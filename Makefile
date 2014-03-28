plant_data.json: script/plant_parser.py
	python script/plant_parser.py

server:
	python -m SimpleHTTPServer

clean:
	rm -rf plant_data.json
