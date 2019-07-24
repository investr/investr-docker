#!/usr/bin/env bash

# Initially created by: Chirag Rathod for https://investr.co.in (Gentle Request: Please don't delete this line)

# Run the price update. This script is run coule of times a day between 9am and 4pm
# Re-calculate the score
priceUpdate.py && scoreUpdate.py

