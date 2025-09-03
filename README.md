# CSV Line Fixer

A Node.js application to fix and format CSV files with common issues like unclosed quotes, broken lines, and inconsistent formatting.

## 🚀 Quick Start

### Prerequisites

- Node.js 16 or higher
- Git (for cloning the repository)

### Installation

Clone from Repository

```bash
# Clone the repository
git clone https://github.com/flaviosp15/csv-line-fixer.git
cd csv-line-fixer
```

## 📋 How to Use

1. Start the application:

```bash
node app.js
```

2. Enter the CSV file path when prompted:

```text
Enter the path of your input file: /path/to/your/file.csv
```

3. Let it process - The app will:

- ✅ Validate your file path and extension
- ✅ Create a fixed version with FIXED- prefix
- ✅ Show processing time and completion status

## ✨ Features

- Removes blank lines and empty value rows
- Fixes unclosed quotes across multiple lines
- Normalizes spaces and quote formatting
- Handles large files efficiently with stream processing
- Validates input with clear error messages

## 📁 Output

Creates a new file in the same directory with FIXED- prefix:

- Input: `my-file.csv`
- Output: `FIXED-my-file.csv`

## 🛠 File Validation

The app checks for:

- ✅ CSV file extension (.csv or .CSV)
- ✅ File existence and read permissions
- ✅ Valid file (not a directory)

## 💡 Examples

Windows:

```text
Enter the path of your input file: C:\Users\name\data\file.csv
```

Mac/Linux:

```text
Enter the path of your input file: ./data/file.csv
```

## ⚡ Performance

- Processes files line by line using streams
- Low memory usage even for large files
- Displays processing time upon completion

## ❓ Need Help?

Common issues:

- Ensure file has `.csv` extension
- Check file exists at the specified path
- Verify read permissions for the file
