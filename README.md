# Tennis Match Calculator

A TypeScript-based tennis match calculator built using **Test-Driven Development (TDD)** with a **bottom-up approach**.

## Development/Thinking Process

After analysing the requirements, I broke it down into the following:

- **Input**: Tournament file with match data and point sequences
- **Output**: Match scores and player game statistics
- **Queries**:
  - `Score Match <id>` - Get match result
  - `Games Player <name>` - Get player's games won/lost
- **Rules**:
  - Game: First to 4 points, must be ahead by 2
  - Set: First to 6 games, no need to be ahead by 2
  - Match: Best of 3 sets, first to 2 sets wins

I used a bottom-up approach and followed TDD (Red - Green - Refactor) process for this challenge, building from the smallest components to the complete application. I started by writing basic test scenarios (Todos) and implementing to make them pass. I tested for code coverage and added test cases for uncovered lines and edge cases. I refactored the implementation when needed (eg. implementing abstractions and dependency injection for clean and modular code)

#### Development Order:

1. **Player.ts** - Basic player stats (wins/losses)
2. **Game.ts** - Tennis game scoring with deuce logic
3. **Set.ts** - Game collection with dependency injection
4. **Match.ts** - Set collection with match rules
5. **TournamentParser.ts** - Integration tests + parsing logic
6. **Refactoring** - Extracted `GameSequenceParser` & `SetConverter`
7. **TennisApp.ts** - CLI controller and application orchestration
8. **index.ts** - Program entry point

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
git clone <repository-url>
cd tennis-calculator
npm install
```

### Running the Application

#### Development Mode (Recommended)

```bash
# Run with tournament file
npm run dev:tournament

# Or run with custom file
npm run dev -- your-tournament-file.txt
```

#### Production Mode

```bash
# Build and run
npm run build
npm start full_tournament.txt
```

### Available Commands

#### In Interactive Mode:

```
Score Match 01          # Get match result for match 01
Games Player Person A   # Get games won/lost for Person A
<Enter>                 # Exit
```

#### Other npm Scripts:

```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run build          # Compile TypeScript to JavaScript
```

## Example Usage

```bash
$ npm run dev:tournament

=== Tennis Tournament Calculator ===
Tournament data loaded successfully!

Available queries:
  Score Match <id>       - Show match result
  Games Player <name>    - Show games won/lost for player

Press Enter (empty line) to exit.

> Score Match 01
Person A defeated Person B
2 sets to 1

> Games Player Person A
12 8

>
Goodbye!
```
