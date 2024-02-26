<?php 

require PLUGIN_BASEPATH .'/vendor/autoload.php';

use Vimeo\Vimeo;

class ClientVimeo extends Vimeo {

    private $client_id;
    private $cliente_secret;
    private $access_token; 

    public function __construct() {

        $this->client_id = ( get_user_blog_data()['api_vimeo']['client_id'] ) ? get_user_blog_data()['api_vimeo']['client_id'] : '';
        $this->cliente_secret = ( get_user_blog_data()['api_vimeo']['client_secret'] ) ? get_user_blog_data()['api_vimeo']['client_secret'] : '';
        $this->access_token = ( get_user_blog_data()['api_vimeo']['access_token'] ) ? get_user_blog_data()['api_vimeo']['access_token'] : '';

        parent::__construct( $this->client_id, $this->cliente_secret, $this->access_token );
    }

    public function createFolder() {
        
        $user = wp_get_current_user();
        
        //$folder = $this->request('/me/albums', [], 'POST');
        $folder = $this->request('/me/projects', [
            'name' => $user->user_nicename,
            'description' => $user->user_nicename . ' library of videos'
        ], 'POST');

        if ($folder['status'] == 201) {

            return explode('/', $folder['body']['uri'])[4];
        }

        return false;
    }

    public function createVideo ( $file, $folder_id ) {

        $create = $this->request('/me/videos/', [
            'upload' => [
                'approach' => 'post',
                'size' => '128'
            ],
            'name' => $title,
            'description' => $description

        ], 'POST');

        return $create;
    }

    public function uploadVideo ( $file, $title, $description ) {

        $upload = $this->request('/me/videos/', [
            'upload' => [
                'approach' => 'tus',
                'size' => $file['size'],
                'upload_link' => $file['tmp_name']
            ],
            'name' => $title,
            'description' => $description
        ], 'POST');

        /* $upload = $this->upload( $file['tmp_name'], array(
            "name" => $title,
            "description" => $description
        )); */

        return $upload;
    }

    public function progressUpload( $file ) {

        /**
         * The response returns the HTTP 200 status code and the Upload-Length and Upload-Offset headers, among others. Determine the completeness of the upload by comparing the values of Upload-Length and Upload-Offset
         * Si Upload-Length y Upload-Offset son iguales, hemos recibido el archivo de video completo.
         * Si Upload-Length es más grande que Upload-Offset no lo hemos hecho.
         */
        
        $progress = $this->request('/me/videos/', [
            'upload' => [
                'upload_link' => $file['tmp_name'],
            ]
        ], 'GET');

        return $progress;

    }

    public function moveVideoToUserFolder ( $folder_id, $uri ) {

        $move = $this->request('/me/projects/' . $folder_id . $uri , [
            'project_id' => $folder_id,
            'video_id' => $uri
        ], 'PUT');

        return $move; //204 success

    }

    public function getStatusTranscode ( $url ) {

        $url = end( explode('/', $url) );

        $response = $this->request( '/videos/' . $url . '?fields=transcode.status');

        return $response['body']['transcode']['status'];

    }

    public function getStatus ( $uri ) {

        $response = $this->request( $uri . '?fields=transcode.status');

        if ($response['body']['transcode']['status'] === 'complete') {

            print 'Your video finished transcoding.';

        } elseif ($response['body']['transcode']['status'] === 'in_progress') {

            print 'Your video is still transcoding.';

        } else {

            print 'Your video encountered an error during transcoding.';
        }
        
    }

    public function getLinkVideo ( $uri ) {

        $response = $this->request( $uri . '?fields=link');

        return $response['body']['link'];
    }

    public function editVideo ( $uri, $title, $description ) {

        $this->request( $uri, array(
            'name' => $title,
            'description' => $description,
        ), 'PATCH');
          
        return 'The title and description for ' . $uri . ' has been edited.';
    }
}