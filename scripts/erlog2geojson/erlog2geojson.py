import re
import json
import argparse


def extract_coords(json_str):
    try:
        data = json.loads(json_str)
        coords = data.get('coords', {})
        if isinstance(coords, dict) and 'latitude' in coords and 'longitude' in coords:
            return {
                'latitude': coords['latitude'],
                'longitude': coords['longitude'],
                'heading': coords.get('heading'),
                'speed': coords.get('speed'),
                'accuracy': coords.get('accuracy'),
                'timestamp': data.get('timestamp'),
                'uuid': data.get('uuid')
            }
    except json.JSONDecodeError:
        pass
    return None


def parse_log(log_content):
    pattern = r'(\d{2}:\d{2}:\d{2}).*?Location tracked.*?(\{.*?"coords":\s*\{.*?"latitude":[^}]+\}.*?\})'
    matches = re.findall(pattern, log_content, re.DOTALL | re.IGNORECASE)

    print(f"Found {len(matches)} matching entries")

    coordinates = []
    properties = []

    for timestamp, match in matches:
        coords = extract_coords(match)
        if coords:
            coordinates.append([coords['longitude'], coords['latitude']])
            properties.append({
                'timestamp': coords.get('timestamp', timestamp),
                'heading': coords.get('heading'),
                'speed': coords.get('speed'),
                'accuracy': coords.get('accuracy'),
                'uuid': coords.get('uuid')
            })
        else:
            print(f"Could not extract coordinates at {timestamp}")

    print(f"Successfully processed {len(coordinates)} entries")
    return coordinates, properties


def create_geojson(coordinates, properties, geometry_type='Point'):
    if not coordinates:
        print("No coordinates found. Cannot create GeoJSON.")
        return None

    features = []
    if geometry_type == 'LineString':
        feature = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            },
            "properties": {
                "coordTimes": [prop['timestamp'] for prop in properties],
                "headings": [prop['heading'] for prop in properties],
                "speeds": [prop['speed'] for prop in properties],
                "accuracies": [prop['accuracy'] for prop in properties],
                "uuids": [prop['uuid'] for prop in properties]
            }
        }
        features.append(feature)
    else:  # Point collection
        for coord, prop in zip(coordinates, properties):
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": coord
                },
                "properties": prop
            }
            features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    return geojson


def main(input_file, output_file, geometry_type):
    try:
        with open(input_file, 'r') as file:
            log_content = file.read()

        print(f"Log file read. Total characters: {len(log_content)}")

        coordinates, properties = parse_log(log_content)

        if not coordinates:
            print("No valid coordinates found in the log file.")
            return

        geojson = create_geojson(coordinates, properties, geometry_type)

        if geojson:
            with open(output_file, 'w') as f:
                json.dump(geojson, f, indent=2)
            print(f"GeoJSON FeatureCollection with {geometry_type} geometry has been saved to {output_file}")
        else:
            print("Failed to create GeoJSON. No output file generated.")

    except FileNotFoundError:
        print(f"Error: The input file '{input_file}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate GeoJSON FeatureCollection from log file")
    parser.add_argument("input_file", help="Path to the input log file")
    parser.add_argument(
        "-o", "--output",
        default="observations.geojson",
        help="Path to the output GeoJSON file (default: location_data.geojson)"
    )
    parser.add_argument(
        "-t", "--type",
        choices=['LineString', 'Point'],
        default='Point',
        help="Geometry type: LineString or Point (default: Point)")
    args = parser.parse_args()

    main(args.input_file, args.output, args.type)
