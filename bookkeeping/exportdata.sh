# Delete the existing .csv files if any.
sudo rm ../mysql/ec2master.csv
sudo rm ../mysql/ec2score.csv
sudo rm ../mysql/ec2hisscr.csv

# Export MASTER and SCORE data to respective csv files.
sudo sqlite3 -csv ./ec2stocks.db "SELECT * FROM MASTER;" > ../mysql/ec2master.csv
sudo sqlite3 -csv ./ec2stocks.db "SELECT * FROM SCORE;"  > ../mysql/ec2score.csv
sudo sqlite3 -csv ./ec2stocks.db "SELECT * FROM HISTORICAL_SCORE;" > ../mysql/ec2hisscr.csv

