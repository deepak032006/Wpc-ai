import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME;
    const publicBaseUrl = process.env.CLOUDFLARE_PUBLIC_BASE_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error("Missing env vars:", {
        accountId: !!accountId,
        accessKeyId: !!accessKeyId,
        secretAccessKey: !!secretAccessKey,
        bucketName: !!bucketName,
      });
      return NextResponse.json(
        { error: "Server misconfiguration: missing env vars" },
        { status: 500 }
      );
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });

    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    const key = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    const publicUrl = `${publicBaseUrl}/${key}`;

    return NextResponse.json({ presignedUrl, publicUrl });
  } catch (err) {
    console.error("Upload presign error:", err);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}