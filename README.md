# Tennis Match Calculator

A TypeScript-based tennis match calculator built using **Test-Driven Development (TDD)** with a **bottom-up approach**.

## Development/Thinking Process

I went with a bottom-up approach and stuck to TDD (Red-Green-Refactor) throughout this project. I started small with the `Player` class and worked my way up to the full application. My process was pretty straightforward: write a failing test, get it to pass with the simplest code possible, then clean it up. I'd start each component by jotting down test scenarios as todos, then turn those into real tests that guided my implementation. Once I had the basics working, I'd run coverage reports to see what I missed and add tests for edge cases and error scenarios. As things got more complex, I found myself refactoring quite a bit - pulling out interfaces like `IMatchRules`, using dependency injection to swap out different rule sets, and splitting big classes into smaller, focused ones like `GameSequenceParser` and `SetConverter`. This kept each piece manageable and made sure everything was well-tested before I moved on to the next layer.

#### Development Order:

1. **Player.ts** - Basic player stats (wins/losses)
2. **Game.ts** - Tennis game scoring with deuce logic
3. **Set.ts** - Game collection with dependency injection
4. **Match.ts** - Set collection with match rules
5. **TournamentParser.ts** - Integration tests + parsing logic
6. **Refactoring** - Extracted `GameSequenceParser` & `SetConverter`
7. **TennisApp.ts** - CLI controller and application orchestration
8. **index.ts** - Program entry point

## How I leveraged AI

Throughout this challenge, I leveraged AI as a pair programmer to enhance code quality and ensure comprehensive testing. After implementing each component using TDD, I used AI to review my test suites and identify potential edge cases I might have missed, such as handling invalid inputs, boundary conditions, and unusual game sequences. AI also helped me discover additional test scenarios that improved my code coverage. During the refactoring phase, I used AI to analyze my code structure and suggest improvements for better separation of concerns - this led to extracting `GameSequenceParser` and `SetConverter` into separate, focused classes. This AI-assisted approach complemented my development process, ensuring both comprehensive testing and clean code architecture.

## Assumptions

- Tournament files are well-formatted with consistent structure (Match: ID, Player vs Player, point sequences)
- Point sequences use only 0 (player1 wins point) and 1 (player2 wins point)
- Match IDs are unique within a tournament file
- Player names don't contain special characters that could break parsing
- Sets are won by first to 6 games (no need for 2 game lead)
- Games use standard tennis scoring (0, 15, 30, 40, deuce, advantage)

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
