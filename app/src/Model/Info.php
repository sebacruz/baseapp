<?php namespace App\Model;

use ArrayObject;

/**
 * Example model
 *
 * @package App\Model
 */
class Info extends ArrayObject {

    /**
     * @param null|string $type
     */
    public function __construct($type = NULL) {
        if ($type === 'get') {
            $data = $_GET;
        }
        else if ($type === 'post') {
            $data = $_POST;
        }
        else {
            $data = $_SERVER;
        }

        parent::__construct($data, ArrayObject::ARRAY_AS_PROPS);
    }

}
