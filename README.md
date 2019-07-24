# InvestR Stock Screener

InvestR is a stock screener for Indian equties built on the standard LEMP stack. 

## InvestR has two parts: 
1) The Webapp
2) Bookkeeping backend

## Requirements for running the webapp:
I have "Dockerized" InvestR so that users can bring up the site with less effort. You need to knowledge of following areas to find your way around it:

1) Amazon Linux running on t2.micro server (or any other service/server with similar configuration)
2) NGINX Web Server
3) MariaDB, which is a port of MySQL
4) Slim Version 3 is used for exposing data in MySql to the webapp
5) Javascript/HTML/CSS is used for building  the webapp
6) UglifyJS is used for minifying the JS

## Requirements for running the bookkeeping backend:
Software requirements for in the bookkeeping backend have not been "Dockerized" as they are very standalone and can easily be run from the command line or as cron jobs.
1) Python (2.7 as of now. Better to upgrade to 3.0)
2) Sqlite DB
3) Google Developer Account for accessing Google Spread Sheets vis gspread)
4) Access to mail server for notification
5) cron for scheduling

## Basic Working:
1) Python scripts in bookkeeping module populate the sqlite database (ec2stocks.db) in the bookkeeping folder
2) Data from Sqlite database is exported-imported to MariaDB MySql database via .csv files

## Steps of bringing up the website

### Acquire a linux server
### Install Docker
### Installing mysqli and pdo_mysql package on PHP
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

### Installing Slim Version 3 (for PHP)
*This needs to be done only once.*

Change into "public" directory: 

`cd public`

and then install Slim using the following command:

`docker run --rm -v $(pwd):/app composer/composer:latest require slim/slim "^3.0"`

### Importing schemas and data into our MySql database
*This needs to be done only once.*

`docker exec -i investr-docker-mysql sh -c 'exec mysql -uroot -p"admin"' < ./mysql/init.sql`

(I tried to automate importing of schemas into our MySql instance using the .yml file but was not able to make a breakthrough. I plan to revisit it.)

### Exporting MASTER, SCORE and HISTORICAL SCORE from Sqlite DB to CSV file and importing it in MySql DB
*This needs to be done DAILY and/or after every time ec2stocks.db is updated via the Python scripts in bookkeeing folder*

To export data from the MASTER, SCORE and HISTORICAL_SCORE tables of Sqlite DB into the CSV file so that I can later be imported into MySql we need to run the following command:

`./bookkeeping/exportdata.sh`

To import data from .csv files (that has been exported from the SQLite DB) we can either run the following shell script:
`./mysql/importdata.sh`

### Start the containers for testing
`docker-compose up`

Note: In currect setup NGINX is serving at port 8080 so that you play with InvestR deployemnt in parallel to your existing project that might be running on port 80.

### Google Sign In
Lastly, you will need to configure Google SigIn. You can either configure it or disable it to begin with.

## Information regarding executing the back-end scripts in bookkeeping folder

* Go thru crontab_ec2.bkup to see which scripts are being executed and at what times
* Currently the scripts are configured to use Google Spreadsheets for getting some information like -- price. Change the scripts appropriately to use your Google Sheets information. If you want to continue with my approach then get gspread module to work and message me. I will share the required spreadsheets.
* Alternatively, you can figure out your own way to refresh data if you wish.
