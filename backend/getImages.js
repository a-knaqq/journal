import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an S3 client using the environment variable for region
const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function getImages() {
    const bucketName = process.env.S3_BUCKET_NAME; // Use the environment variable for the bucket name
    const prefix = 'assets/images/'; // Specify the folder prefix

    try {
        const command = new ListObjectsCommand({
            Bucket: bucketName,
            Prefix: prefix, // Set the prefix to filter objects
        });
        const response = await s3Client.send(command);

        // Map the results to construct the image URLs
        const images = response.Contents.map(item => {
            return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
        });

        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw new Error('Unable to retrieve images');
    }
}

export const handler = async (event) => {
    try {
        const images = await getImages();
        return {
            statusCode: 200,
            body: JSON.stringify(images),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://akportfolio-host.s3-website-us-east-1.amazonaws.com',
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://akportfolio-host.s3-website-us-east-1.amazonaws.com',
            },
        };
    }
};

// Testing 
getImages().then(images => {
    console.log('Images:', images);
}).catch(err => {
    console.error(err);
});
