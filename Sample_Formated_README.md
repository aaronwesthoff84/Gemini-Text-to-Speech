# OpenHands Setup Scripts

A comprehensive collection of setup scripts and testing tools for OpenHands, designed to make installation and configuration seamless across different environments.

## 🚀 Quick Start

### For End Users

Simply download and run the setup script:

```bash
curl -O https://raw.githubusercontent.com/aaronwesthoff84/openhands-setup-scripts/main/setup_openhands.sh
chmod +x setup_openhands.sh
./setup_openhands.sh
```

The script will:
- ✅ Detect your shell (bash, zsh, fish)
- ✅ Check for and optionally install `uv`
- ✅ Ask about GPU support preferences
- ✅ Create an `openhands` command alias
- ✅ Backup existing configuration files

### For Developers

Clone the repository to access the full testing suite:

```bash
git clone https://github.com/aaronwesthoff84/openhands-setup-scripts.git
cd openhands-setup-scripts
```

## 📁 Repository Structure

```
├── setup_openhands.sh          # Main setup script for end users
├── openhands_runner.sh          # Alternative runner script
├── tests/                       # Comprehensive testing suite
│   ├── run_tests.sh            # Test runner
│   ├── test_helper.bash        # Test utilities and mocks
│   ├── README.md               # Testing documentation
│   ├── MANUAL_TESTING_GUIDE.md # Manual testing instructions
│   ├── unit/                   # Unit tests (26 tests)
│   └── integration/            # Integration tests (5 tests)
└── README.md                   # This file
```

## 🛠️ Scripts Overview

### `setup_openhands.sh`
The main setup script that provides:
- **Shell Detection**: Automatically detects bash, zsh, or fish
- **UV Management**: Checks for and installs `uv` if needed
- **GPU Support**: Optional GPU acceleration configuration
- **Safe Configuration**: Creates backups before modifying config files
- **Cross-Platform**: Works on macOS, Linux, and Windows (Git Bash)

### `openhands_runner.sh`
An alternative runner script with:
- **Configurable Delay**: Adjustable browser opening delay
- **GPU Support**: Optional `--gpu` flag
- **Directory Targeting**: Runs from specified project directory

## 🧪 Testing

The repository includes a comprehensive testing suite with **31 automated tests**:

### Run All Tests
```bash
./tests/run_tests.sh
```

### Test Coverage
- **Unit Tests (26)**: Individual function testing
- **Integration Tests (5)**: End-to-end workflow testing
- **Mock Environment**: Safe testing without system modifications
- **Cross-Platform**: Tests for macOS, Linux, Windows scenarios

See [tests/README.md](tests/README.md) for detailed testing documentation.

## 🔧 Requirements

### For End Users
- **Shell**: bash, zsh, or fish
- **System**: macOS, Linux, or Windows with Git Bash
- **Network**: Internet connection for downloading dependencies

### For Developers/Testing
- **BATS**: Bash Automated Testing System
- **Git**: Version control
- **Standard Unix utilities**: grep, sed, curl, etc.

## 🚀 Usage Examples

### Basic Setup
```bash
./setup_openhands.sh
# Follow the interactive prompts
```

### After Setup
```bash
# Simply run OpenHands
openhands

# The alias expands to:
# uvx --python 3.12 --from openhands-ai openhands serve [--gpu]
```

## 🛡️ Safety Features

- **Backup Creation**: Automatically backs up existing shell configuration files
- **Non-Destructive**: Never overwrites existing configurations without backup
- **Validation**: Comprehensive input validation and error handling
- **Rollback Instructions**: Clear guidance for undoing changes if needed

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch
3. **Add tests** for new functionality
4. **Run tests** to ensure no regressions
5. **Submit** a pull request

### Testing New Changes
```bash
# Run the full test suite
./tests/run_tests.sh

# Test specific components
bats tests/unit/test_shell_detection.bats
bats tests/integration/test_full_workflow.bats
```

## 📋 Manual Testing

For comprehensive manual testing across different environments, see:
- [tests/MANUAL_TESTING_GUIDE.md](tests/MANUAL_TESTING_GUIDE.md)

## 🐛 Troubleshooting

### Common Issues

**Script doesn't detect my shell**
- Ensure your shell sets the appropriate version variable (`$ZSH_VERSION`, `$BASH_VERSION`, `$FISH_VERSION`)
- Check that `$SHELL` environment variable is set correctly

**UV installation fails**
- Check internet connectivity
- Verify you have permissions to install software
- Try manual installation from [uv documentation](https://docs.astral.sh/uv/getting-started/installation/)

**OpenHands command not found after setup**
- Restart your terminal or run `source ~/.bashrc` (or appropriate config file)
- Verify the alias was added to your shell configuration file

### Getting Help

1. Check the [manual testing guide](tests/MANUAL_TESTING_GUIDE.md)
2. Run the test suite to identify issues
3. Create an issue with:
   - Your operating system and version
   - Shell type and version
   - Complete error output
   - Steps to reproduce

## 📄 License

This project is private and intended for specific collaborators only.

## 🔒 Privacy

This is a **private repository**. Access is restricted to invited collaborators only. Please do not share the repository URL or contents without permission.

---

**Note**: This repository contains setup scripts for OpenHands. Make sure you have the necessary permissions and understand the implications before running any scripts on your system.