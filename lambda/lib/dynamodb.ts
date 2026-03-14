import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
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
