# investr-docker

### Importing schemas and data into our MySql database:

I tried to automate importing of schemas into our MySql instance using the .yml file but was not able to make a breakthrough.

Hence as of now I am using the following command:

docker exec -i investr-docker-mysql sh -c 'exec mysql -uroot -p"admin"' < ./mysql/init.sql

### Installing Slim (for PHP)
Change into "public" directory: cd public

and then install Slim using the following command:

docker run --rm -v $(pwd):/app composer/composer:latest require slim/slim "^3.0"
