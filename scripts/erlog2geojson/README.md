# erlog2geojson

This Python cli script (`erlog2geojson.py`) processes an EarthRanger Mobile log file and generates a GeoJSON FeatureCollection. It can create either a collection of Point features or a single LineString feature based on the extracted track observation coordinates from the log.

## Features

- Extracts location data from a structured log file
- Generates a GeoJSON FeatureCollection with either Point or LineString geometry
- Includes additional properties such as timestamp, heading, speed, accuracy, and UUID
- Provides command-line interface for easy usage

## Requirements

- Python 3.x
- No additional libraries required (uses only built-in modules)

## Installation

1. Clone this repository or download the `erlog2geojson.py` file.
2. Ensure you have Python 3.x installed on your system.

## Usage

Run the script from the command line with the following syntax:

```bash
python erlog2geojson.py input_file [-o OUTPUT] [-t {LineString,Point}]
```

### Arguments:

| Argument | Description |
|----------|-------------|
| `input_file` | Path to the input log file (required) |
| `-o OUTPUT`, `--output OUTPUT` | Path to the output GeoJSON file (default: "location_data.geojson") |
| `-t {LineString,Point}`, `--type {LineString,Point}` | Geometry type: LineString or Point (default: Point) |

### Examples:

1. Generate a GeoJSON file with Point features:
   ```bash
   python erlog2geojson.py path/to/logfile.log
   ```

2. Generate a GeoJSON file with a LineString feature and specify the output file:
   ```bash
   python erlog2geojson.py path/to/logfile.log -o my_route.geojson -t LineString
   ```

## Input File Format

The script expects a log file with entries in the following format:

```
HH:MM:SS ... Location tracked ... {"coords": {"latitude": X, "longitude": Y, ...}, ...}
```

Each log entry should contain a timestamp and a JSON string with location data.

## Output

The script generates a GeoJSON file containing a FeatureCollection. Depending on the chosen geometry type:

- **Point**: Each location becomes a separate Point feature with its properties.
- **LineString**: All locations are combined into a single LineString feature, with properties as arrays corresponding to each point.

## Error Handling

- The script will print error messages for common issues like file not found or invalid JSON data.
- If no valid coordinates are found in the log file, the script will exit without creating an output file.


