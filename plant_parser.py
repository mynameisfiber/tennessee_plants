#!/usr/bin/env python2.7

from urlparse import urljoin
from lxml import html
import re
import ujson as json

URLPATH= "http://www.tva.gov/cgi-bin/plantDB/searchNativePlants.pl?showAll=1&sort=Common"

def parse_file(filepath):
    print "Parsing:", filepath

    url = urljoin(URLPATH, filepath)
    dom = html.parse(url).getroot()

    photo = dom.xpath('.//img[@alt="photo of plant"]/@src')[0]
    data_nodes = dom.xpath('.//tr[th/following-sibling::td]')

    data = {}
    for node in data_nodes:
        label = " ".join(x.strip() for x in node.find("th").itertext())
        value = " ".join(x for x in node.find("td").itertext())

        label = label.lower().replace(" ", "_")
        value, _ = re.subn(r"(\n)?[ ]{2,}", " ", value.strip())
        if label == "height":
            if value.startswith("less than"):
                height_min = "0'"
                height_max = value[10:]
            elif value.startswith("over"):
                height_min = value[5:]
                height_max = "&infin;'"
            else:
                if 'to' in value:
                    height_min, height_max = re.split("[ ]?to[ ]?", value)
                else:
                    height_min, height_max = re.split("[ ]?-[ ]?", value)
                    height_min += "'"
            data["height_min"] = height_min
            data["height_max"] = height_max
        else:
            data[label] = value

    data["picture"] = urljoin(URLPATH, photo)
    data["url"] = url
    return data

if __name__ == "__main__":
    base_data = html.parse(URLPATH).getroot()
    plants = base_data.xpath('.//a[contains(@href,"plants")]/@href')

    data = map(parse_file, plants)
    json.dump(data, open("plant_data.json", "w+"))
