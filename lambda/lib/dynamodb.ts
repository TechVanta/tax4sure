import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE = process.env.DYNAMODB_TABLE_NAME || "tax4sure-users";

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  passwordHash: string;
  mobile: string;
  createdAt: string;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: TABLE, Key: { username } })
  );
  return (result.Item as User) ?? null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    })
  );
  return (result.Items?.[0] as User) ?? null;
}

export async function findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
  const byUsername = await findUserByUsername(usernameOrEmail);
  if (byUsername) return byUsername;
  return findUserByEmail(usernameOrEmail);
}

export async function listAllUsers(): Promise<Omit<User, "passwordHash">[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TABLE,
      ProjectionExpression: "id, username, email, fullName, createdAt",
    })
  );
  return (result.Items as Omit<User, "passwordHash">[]) ?? [];
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  const user: User = { id: crypto.randomUUID(), ...data };
  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: user,
      ConditionExpression: "attribute_not_exists(username)",
    })
  );
  return user;
}

export async function updateUserPassword(username: string, passwordHash: string): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { username },
      UpdateExpression: "SET passwordHash = :hash",
      ExpressionAttributeValues: { ":hash": passwordHash },
    })
  );
}

// ─── Cases ────────────────────────────────────────────────────────────────────

const CASES_TABLE = process.env.CASES_TABLE_NAME || "tax4sure-cases";

export type CaseStatus = "not_started" | "in_progress" | "done" | "needs_documents";
export type PaymentStatus = "pending" | "paid" | "overdue";

export interface Case {
  caseId: string;
  username: string;
  serviceType: string;
  year: string;
  status: CaseStatus;
  paymentStatus: PaymentStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export async function createCase(data: Omit<Case, "caseId">): Promise<Case> {
  const item: Case = { caseId: crypto.randomUUID(), ...data };
  await docClient.send(new PutCommand({ TableName: CASES_TABLE, Item: item }));
  return item;
}

export async function getCaseById(caseId: string): Promise<Case | null> {
  const result = await docClient.send(
    new GetCommand({ TableName: CASES_TABLE, Key: { caseId } })
  );
  return (result.Item as Case) ?? null;
}

export async function getCasesByUsername(username: string): Promise<Case[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: CASES_TABLE,
      IndexName: "UsernameIndex",
      KeyConditionExpression: "username = :u",
      ExpressionAttributeValues: { ":u": username },
    })
  );
  return (result.Items as Case[]) ?? [];
}

export async function getAllCases(): Promise<Case[]> {
  const result = await docClient.send(new ScanCommand({ TableName: CASES_TABLE }));
  return (result.Items as Case[]) ?? [];
}

export async function updateCase(
  caseId: string,
  updates: Partial<Pick<Case, "status" | "paymentStatus" | "adminNotes">>
): Promise<Case | null> {
  const setClauses: string[] = ["updatedAt = :ua"];
  const values: Record<string, string> = { ":ua": new Date().toISOString() };

  if (updates.status !== undefined) { setClauses.push("#st = :st"); values[":st"] = updates.status; }
  if (updates.paymentStatus !== undefined) { setClauses.push("paymentStatus = :ps"); values[":ps"] = updates.paymentStatus; }
  if (updates.adminNotes !== undefined) { setClauses.push("adminNotes = :an"); values[":an"] = updates.adminNotes; }

  const result = await docClient.send(
    new UpdateCommand({
      TableName: CASES_TABLE,
      Key: { caseId },
      UpdateExpression: `SET ${setClauses.join(", ")}`,
      // 'status' is a reserved word in DynamoDB — use expression name alias
      ExpressionAttributeNames: updates.status !== undefined ? { "#st": "status" } : undefined,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    })
  );
  return (result.Attributes as Case) ?? null;
}

export async function deleteCaseById(caseId: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: CASES_TABLE, Key: { caseId } })
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

const NOTIFICATIONS_TABLE = process.env.NOTIFICATIONS_TABLE_NAME || "tax4sure-notifications";

export type NotificationType = "document_request" | "status_update" | "payment_update" | "new_upload";

export interface Notification {
  notificationId: string;
  recipientUsername: string;
  type: NotificationType;
  message: string;
  read: boolean;
  caseId?: string;
  createdAt: string;
}

export async function createNotification(data: Omit<Notification, "notificationId">): Promise<Notification> {
  const item: Notification = { notificationId: crypto.randomUUID(), ...data };
  await docClient.send(new PutCommand({ TableName: NOTIFICATIONS_TABLE, Item: item }));
  return item;
}

export async function getNotificationsByRecipient(recipientUsername: string): Promise<Notification[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: NOTIFICATIONS_TABLE,
      IndexName: "RecipientIndex",
      KeyConditionExpression: "recipientUsername = :r",
      ExpressionAttributeValues: { ":r": recipientUsername },
    })
  );
  const items = (result.Items as Notification[]) ?? [];
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markNotificationsRead(
  recipientUsername: string,
  notificationIds?: string[]
): Promise<void> {
  const all = await getNotificationsByRecipient(recipientUsername);
  const toMark = notificationIds?.length
    ? all.filter((n) => notificationIds.includes(n.notificationId) && !n.read)
    : all.filter((n) => !n.read);

  await Promise.all(
    toMark.map((n) =>
      docClient.send(
        new UpdateCommand({
          TableName: NOTIFICATIONS_TABLE,
          Key: { notificationId: n.notificationId },
          UpdateExpression: "SET #r = :t",
          ExpressionAttributeNames: { "#r": "read" },
          ExpressionAttributeValues: { ":t": true },
        })
      )
    )
  );
}
