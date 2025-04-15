import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

// Initialize AWS clients
const ssmClient = new SSMClient({ region: "us-east-1" });

// Function to retrieve parameters from AWS Systems Manager Parameter Store
async function getParameter(name, isSecure = false) {
    try {
        const command = new GetParameterCommand({ Name: name, WithDecryption: isSecure });
        const response = await ssmClient.send(command);
        return response.Parameter.Value;
    } catch (error) {
        console.error(`Error retrieving parameter ${name}:`, error);
        throw new Error(`Failed to retrieve parameter: ${name}`);
    }
}

// Lambda handler function
export const handler = async () => {
    try {
        // Retrieve parameters from Parameter Store
        const region = await getParameter("/imageRetrieval/aws-region");
        const bucketName = await getParameter("/imageRetrieval/s3-bucket");

        // Initialize S3 client with the retrieved region
        const s3Client = new S3Client({ region });

        // List objects in the S3 bucket
        const command = new ListObjectsCommand({ Bucket: bucketName });
        const response = await s3Client.send(command);

        if (!response.Contents) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "No images found in bucket" }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            };
        }

        // Construct image URLs
        const images = response.Contents.map((item) => 
            `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`
        );

        return {
            statusCode: 200,
            body: JSON.stringify(images),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        };
    } catch (error) {
        console.error("Error fetching images:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Unable to retrieve images" }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        };
    }
};
