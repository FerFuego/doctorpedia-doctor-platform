<?php
/**
 * Public Class to connect with URLIFE services
 */
class ClientURLife {

    private $urlife = URLIFE;
    private $user = USER_URLIFE;
    private $pass = PASS_URLIFE;
    private $packageSKU = PACKAGE_SKU;
    private $packageId = PACKAGE_ID;
    private $headers = array();
    private $status;
    public $cogniToken;
    public $identityId;

    public function __construct () {

        if ($this->status !== 'connected') {
            $result = $this->loginAPI();
            if ( $result == 200 ) {
                $this->cognitoAPI();
            }
        }
    }

    public function loginAPI() {

        $content = array(
            "email" => $this->user,
            "password" => $this->pass
        );

        $curl = curl_init($this->urlife . '/auth/local/verify');
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($content));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $output = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        $response = json_decode($output, true);
        $response = (object)$response;

        if ( $status !== 200) {
            return $response;
        }

        $this->headers = array(
            "Content-type: application/json",
            "Authorization: Bearer ". $response->access_token
        );

        return 200;
    }

    public function cognitoAPI() {

        $curl = curl_init();
        $url = $this->urlife . '/user/me/cognito';

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $output = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        $response = json_decode($output, true);
        $response = (array)$response;

        if ( $status !== 200) {
            return $response;
        }

        $this->cogniToken = $response['data']['Token'];
        $this->identityId = $response['data']['IdentityId'];
        $this->status = 'connected';

        return $response;
    }

    public function getStatus() {
        return $this->status; 
    }

    public function setProject($title, $description) {

        $content = array(
            "title"         => $title, 
            "description"   => $description,
            "packageId"     => $this->packageId,
        );
        $result = $this->callcURL('POST', '/projects', $content);
        return $result;
    }

    public function callcURL($method, $url, $content) {

        $url = $this->urlife.$url;
        $curl = curl_init();

        switch ($method){
            case "GET":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
                if ($content)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($content));
                break;
            case "POST":
                curl_setopt($curl, CURLOPT_POST, true);
                if ($content)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($content));
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
                if ($content)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($content));			 					
                break;
            case "DELETE":
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
                if ($content)
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($content));			 					
                break;
            default:
                if ($content)
                    $url = sprintf("%s?%s", $url, http_build_query($content));
        }

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $output = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        $response = json_decode($output, true);

        return $response;
    }

    public function deleteProject($id) {
        $result = $this->callcURL('DELETE', '/projects/'.$id, false);
        return $result;
    }

}