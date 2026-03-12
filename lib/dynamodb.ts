import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "tax4sure-users";

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
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { username },
    })
  );
  return (result.Item as User) ?? null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    })
  );
  return (result.Items?.[0] as User) ?? null;
}

export async function findUserByUsernameOrEmail(
  usernameOrEmail: string
): Promise<User | null> {
  const byUsername = await findUserByUsername(usernameOrEmail);
  if (byUsername) return byUsername;
  return findUserByEmail(usernameOrEmail);
}

export async function createUser(
  data: Omit<User, "id">
): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    ...data,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
      ConditionExpression: "attribute_not_exists(username)",
    })
  );

  return user;
}
