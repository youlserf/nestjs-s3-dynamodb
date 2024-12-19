import {
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { AwsService } from '../../config/aws.config';

@Injectable()
export class FilesService {
  private readonly bucketName = process.env.S3_BUCKET_NAME;
  private readonly tableName = process.env.DYNAMODB_TABLE_NAME;
  private readonly userIdIndex = 'userId-index';

  constructor(private readonly awsService: AwsService) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    console.log('Uploaded file:', file);

    const s3Params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: `${userId}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.awsService.getS3Client().send(new PutObjectCommand(s3Params));

    const dynamoParams: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        fileId: { S: `${userId}/${file.originalname}` },
        userId: { S: userId.toString() },
        size: { N: file.size.toString() },
        createdAt: { S: new Date().toISOString() },
      },
    };

    await this.awsService.getDynamoClient().send(new PutItemCommand(dynamoParams));

    return { message: 'File uploaded successfully!' };
  }

  async getFile(fileId: string) {
    const s3Params: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: fileId,
    };

    const command = new GetObjectCommand(s3Params);

    const signedUrl = await getSignedUrl(this.awsService.getS3Client(), command, { expiresIn: 3600 });

    return {
      fileUrl: signedUrl,
    };
  }

  async getUserFiles(userId: string) {
    const dynamoParams: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId.toString() },
      },
    };

    const result = await this.awsService.getDynamoClient().send(new QueryCommand(dynamoParams));
    return result.Items?.map(item => ({
      fileId: item.fileId.S,
      size: item.size.N,
      createdAt: item.createdAt.S,
    })) || [];
  }
}
