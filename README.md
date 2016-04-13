# Massively over-engineered wedding website

Getting married...a great excuse to try out Angular 2.

# Notes (mainly to self)
## Build database

`mongoimport --host <ip> --port <port> --file <file> --headerline --stopOnError --type csv --collection <collection> --db my_database --upsert`

## Export database

`mongoexport --host <ip> --port <port> --fieldFile <file> --out <file> --type csv --collection <collection> --db my_database`

