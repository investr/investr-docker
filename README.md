# InvestR Stock Screener

InvestR is a stock screener for Indian equties built on the standard LEMP stack.

Many thanks to https://github.com/cbzxt for resurrecting the screener at https://investr.xyz

## InvestR has two parts: 
- The Webapp
- Bookkeeping backend

## Requirements for running the webapp:
I have "Dockerized" InvestR so that users can bring up the site with less effort. You need to have knowledge of following areas to find your way around it:

- Amazon Linux running on t2.micro server (or any other service/server with similar configuration)
- Docker
- NGINX Web Server
- PHP
- MariaDB, which is a port of MySQL
- Slim Version 3 is used for exposing data in MySql to the webapp
- Javascript/HTML/CSS is used for the webapp
- UglifyJS is used for minifying the JS

## Requirements for running the bookkeeping backend:
Software requirements for in the bookkeeping backend have not been "Dockerized" as they are very standalone and can easily be run from the command line or as cron jobs. You need to install bunch of Python modules for this to work. Just run `grep import *.py` in the bookkeeping directory to get the list

- Python (2.7 as of now. Better to upgrade to 3.0)
- Sqlite DB
- Google Developer Account for accessing Google Spread Sheets vis gspread
- Access to mail server for notifications
- cron for scheduling

## Basic Working:
- Python scripts in bookkeeping module populate the sqlite database (ec2stocks.db) in the bookkeeping folder
- Data from Sqlite database is exported-imported to MariaDB MySql database via .csv files

## Steps of bringing up the website

### Acquire a linux server
### Install Docker
### Install mysqli and pdo_mysql packages for PHP
*This needs to be done only once.*

Need to do this as PHP 7 does not come with these DB access packages and they need to added manually.

```
docker exec -ti <your-php-container> sh
$ docker-php-ext-install mysqli
$ docker-php-ext-enable mysqli
$ docker-php-ext-install pdo_mysql
$ docker-php-ext-enable pdo_mysql 
```

Now restart the container.

### Install Slim Version 3 for REST APIs
*This needs to be done only once.*

Change into "public" directory: 

`cd public`

and then install Slim using the following command:

`docker run --rm -v $(pwd):/app composer/composer:latest require slim/slim "^3.0"`

### Create schemas in MySql database
*This needs to be done only once.*

`docker exec -i investr-docker-mysql sh -c 'exec mysql -uroot -p"admin"' < ./mysql/init.sql`

(I tried to automate importing of schemas into our MySql instance using the .yml file but was not able to make a breakthrough. I plan to revisit it.)

### Export MASTER, SCORE and HISTORICAL SCORE from Sqlite DB to CSV file and import it in MySql DB
*This needs to be done DAILY and/or after every time ec2stocks.db is updated via the Python scripts in bookkeeing folder*

To export data from the MASTER, SCORE and HISTORICAL_SCORE tables of Sqlite DB into the CSV file so that I can later be imported into MySql we need to run the following command:

`./bookkeeping/exportdata.sh`

To import data from .csv files (that has been exported from the SQLite DB) we can either run the following shell script:

`./mysql/importdata.sh`

### Set DB Host value
*This needs to be done every time you launch your containers*

`docker inspect <container name/id> | grep -i ipaddress`

Set value of `$dbhost` in `./public/investr.php` to the IP obtained above. 

I need to find a way to use a DB host value that does not change on every launch.

### Start the containers for testing

`docker-compose up`

Note: In currect setup NGINX is serving at port 8080 so that you play with InvestR deployemnt in parallel to your existing project that might be running on port 80.

### Google Sign In

Lastly, you will need to configure Google SigIn. You can either configure it or disable it to begin with.

## Information regarding executing the back-end scripts in bookkeeping folder

- Go thru crontab_ec2.bkup to see which scripts are being executed and at what times
- Currently the scripts are configured to use Google Spreadsheets for getting some information like viz. price. Change the scripts appropriately to use your Google Sheets information. If you want to continue with my approach then get gspread module to work and message me. I will share the required spreadsheets.
- Alternatively, you can figure out your own way to refresh data if you wish.
- I will periodically keep updating `ec2stocks.db` with the latest data, so that initially you dont have to worry about the backend refresh to Sqlite DB.

