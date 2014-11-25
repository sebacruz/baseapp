Base App
=======

First install the composer dependencies, if you don't have composer [go get it](https://getcomposer.org/doc/00-intro.md):

```
$ composer install
```

Copy .env.dist file to .env and set your needed environment variables, like database
credentials:

 ```
$ cp .env.dist .env
$ vi .env
```

If you don't set the ENVIRONMENT variable it will be "production" by default.
