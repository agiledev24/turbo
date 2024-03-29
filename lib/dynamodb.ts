"use server";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});

export const createUser = async (userId: string) => {
  const Item = {
    userID: { S: userId },
    imageCredits: { N: process.env.NEXT_PUBLIC_USER_IMAGES_CREDITS_DEFAULT! },
    videoCredits: { N: process.env.NEXT_PUBLIC_USER_VIDEOS_CREDITS_DEFAULT! },
  };
  try {
    await client.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_USER_CREDITS_TABLE_NAME,
        ConditionExpression: "attribute_not_exists(userID)",
        Item,
      })
    );
  } catch (error) {
    console.log("User exists");
  }
};

export const incrementUserCredits = async (userId: string) => {
  const { Attributes } = await client.send(
    new UpdateItemCommand({
      TableName: process.env.DYNAMODB_USER_CREDITS_TABLE_NAME,
      Key: {
        userID: { S: userId },
      },
      UpdateExpression: "SET credits = credits + :increment",
      ExpressionAttributeValues: {
        ":increment": { N: "1" },
      },
      ReturnValues: "ALL_NEW",
    })
  );

  return Attributes;
};

export const decrementUserCredits = async (
  userId: string,
  contentType: "video" | "image"
) => {
  const type = contentType === "video" ? "videoCredits" : "imageCredits";

  const { Attributes } = await client.send(
    new UpdateItemCommand({
      TableName: process.env.DYNAMODB_USER_CREDITS_TABLE_NAME,
      Key: {
        userID: { S: userId },
      },
      UpdateExpression: `SET ${type} = ${type} - :increment`,
      ExpressionAttributeValues: {
        ":increment": { N: "1" },
      },
      ReturnValues: "ALL_NEW",
    })
  );

  return Attributes ? unmarshall(Attributes) : null;
};

export const getUserCredits = async (userId: string) => {
  const { Item } = await client.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_USER_CREDITS_TABLE_NAME,
      Key: {
        userID: { S: userId },
      },
    })
  );

  return Item ? unmarshall(Item) : null;
};
