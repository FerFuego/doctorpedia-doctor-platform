<?php
/**
 * Public Class to connect with AWS services
 */
require PLUGIN_BASEPATH .'/vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

class awsCli {

    private $S3 = [];
    private $AWS_KEY = AWS_KEY;
    private $AWS_SECRET = AWS_SECRET;
    private $BUCKET_AWS = BUCKET_AWS;

    public function __construct () {

        // Connect to AWS
        try {
            // Custom Connect with normal credentials
            $this->S3 = S3Client::factory(
                array(
                    'credentials' => array(
                        'key' => $this->AWS_KEY,
                        'secret' => $this->AWS_SECRET
                    ),
                    'version' => 'latest',
                    'region'  => 'us-east-2'
                )
            );
            return $this->S3;

        } catch (Exception $e) {
            die("Error: " . $e->getMessage());
        }
    }

    public function uploadFile($upload, $folder) { 

        $keyName  = $folder . '/' . basename($upload['name']); // Custom - Private AWS Account
        $pathInS3 = 'https://s3.us-east-2.amazonaws.com/' . $this->BUCKET_AWS . '/' . $keyName;
        
        // Add it to S3
        try {

            $this->S3->putObject([
                'Bucket' =>  $this->BUCKET_AWS,
                'Key' =>  $keyName,
                'SourceFile' => $upload['tmp_name'],
                'StorageClass' => 'REDUCED_REDUNDANCY',
                'apiVersion' => 'latest',
                'ACL' => 'public-read'
            ]);

            return $pathInS3;

        } catch (S3Exception $e) {
            die('Error:' . $e->getMessage());
        } catch (Exception $e) {
            die('Error:' . $e->getMessage());
        }

    }
}