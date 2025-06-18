import { TennisApp } from '../src/TennisApp';
import * as fs from 'fs';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Tennis Application', () => {
  let app: TennisApp;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    app = new TennisApp();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    app.cleanup();
  });

  describe('Tournament File Loading', () => {
    it('should load tournament data without displaying results', () => {
      const mockTournamentData = `Match: 01
        Person A vs Person B
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        Match: 02
        Person A vs Person C
        0
        0
        0
        0
        1
        1
        1
        1`;

      mockedFs.readFileSync.mockReturnValue(mockTournamentData);

      app.loadTournamentFile('test-tournament.txt');

      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        'test-tournament.txt',
        'utf-8'
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should handle file not found error gracefully', () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => {
        app.loadTournamentFile('nonexistent.txt');
      }).toThrow('File not found: nonexistent.txt');
    });
  });

  describe('Score Match Query', () => {
    beforeEach(() => {
      const mockTournamentData = `Match: 01
        Person A vs Person B
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        Match: 02
        Person A vs Person C
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        0
        0
        0
        0

        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1

        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        0
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        1
        `;

      mockedFs.readFileSync.mockReturnValue(mockTournamentData);
      app.loadTournamentFile('full_tournament.txt');
      consoleLogSpy.mockClear();
    });

    it('should display match score with correct format for completed match', () => {
      app.processQuery('Score Match 01');

      expect(consoleLogSpy).toHaveBeenCalledWith('Person A defeated Person B');
      expect(consoleLogSpy).toHaveBeenCalledWith('2 sets to 0');
    });

    it('should display match score for three-set match', () => {
      app.processQuery('Score Match 02');

      expect(consoleLogSpy).toHaveBeenCalledWith('Person C defeated Person A');
      expect(consoleLogSpy).toHaveBeenCalledWith('2 sets to 1');
    });

    it('should handle non-existent match ID', () => {
      expect(() => {
        app.processQuery('Score Match 99');
      }).toThrow('Match not found: 99');
    });

    it('should handle invalid query format', () => {
      expect(() => {
        app.processQuery('Score Match');
      }).toThrow('Invalid query format. Expected: Score Match <id>');
    });
  });

  describe('Games Player Query', () => {
    beforeEach(() => {
      const mockTournamentData = `Match: 01
Person A vs Person B
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
Match: 02
Person A vs Person C
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
0
0
0
0

1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1

0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
0
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
1
`;

      mockedFs.readFileSync.mockReturnValue(mockTournamentData);
      app.loadTournamentFile('full_tournament.txt');
      consoleLogSpy.mockClear(); // Clear setup calls
    });

    it('should display games won and lost for a player', () => {
      app.processQuery('Games Player Person A');

      expect(consoleLogSpy).toHaveBeenCalledWith('23 17');
    });

    it('should display games for different player', () => {
      app.processQuery('Games Player Person B');

      expect(consoleLogSpy).toHaveBeenCalledWith('0 12');
    });

    it('should handle non-existent player', () => {
      expect(() => {
        app.processQuery('Games Player Unknown Player');
      }).toThrow('Player not found: Unknown Player');
    });

    it('should handle invalid query format', () => {
      expect(() => {
        app.processQuery('Games Player');
      }).toThrow('Invalid query format. Expected: Games Player <Player Name>');
    });
  });

  describe('Command Line Interface', () => {
    it('should display help message when no arguments provided', () => {
      // Act
      app.run([]);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Tennis Tournament Calculator'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Usage: node index.js <tournament-file>'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Example: node index.js full_tournament.txt'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith('');
      expect(consoleLogSpy).toHaveBeenCalledWith('Available queries:');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '  Score Match <id>       - Show match result'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '  Games Player <name>    - Show games won/lost for player'
      );
    });

    it('should load tournament file when filename is provided', () => {
      const mockTournamentData = `Match: 01
  Person A vs Person B
  0
  0
  0
  0`;

      mockedFs.readFileSync.mockReturnValue(mockTournamentData);
      app.run(['test.txt']);

      expect(mockedFs.readFileSync).toHaveBeenCalledWith('test.txt', 'utf-8');
    });
  });

  describe('Invalid Queries', () => {
    beforeEach(() => {
      const mockTournamentData = `Match: 01
  Person A vs Person B
  0
  0
  0
  0`;

      mockedFs.readFileSync.mockReturnValue(mockTournamentData);
      app.loadTournamentFile('test.txt');
      consoleLogSpy.mockClear();
    });

    it('should handle unknown query commands', () => {
      expect(() => {
        app.processQuery('Unknown Command');
      }).toThrow(
        'Unknown query command. Available commands: Score Match, Games Player'
      );
    });

    it('should handle empty query', () => {
      expect(() => {
        app.processQuery('');
      }).toThrow('Query cannot be empty');
    });
  });
});
