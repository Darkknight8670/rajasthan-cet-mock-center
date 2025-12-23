
import { TestMetadata, Question } from '../types';

/**
 * Utility to parse CSV strings into objects.
 * Handles basic comma-separated values.
 */
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/);
  return lines
    .map(line => {
      // Basic split by comma, ignoring commas inside quotes for now (simplification)
      return line.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
    })
    .filter(row => row.length > 1 && row[0] !== '');
}

export async function fetchMasterIndex(url: string): Promise<TestMetadata[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch master index');
    const text = await response.text();
    const rows = parseCSV(text);
    
    // Skip header row: Title, Duration, Category, CSV Link
    return rows.slice(1).map((row, index) => ({
      id: `sheet-${index}`,
      title: row[0] || 'Untitled Test',
      durationMinutes: parseInt(row[1]) || 180,
      category: row[2] || 'General',
      questionCount: 0, // Will be updated once questions load
      csvUrl: row[3]
    }));
  } catch (error) {
    console.error("Master Index Fetch Error:", error);
    return [];
  }
}

export async function fetchQuestionsFromCSV(url: string): Promise<Question[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch questions');
    const text = await response.text();
    const rows = parseCSV(text);
    
    // Header: Question, A, B, C, D, Correct, Subject
    return rows.slice(1).map((row, index) => ({
      id: index + 1,
      text: row[0] || 'Missing Question Text',
      options: {
        A: row[1] || '',
        B: row[2] || '',
        C: row[3] || '',
        D: row[4] || '',
      },
      correctAnswer: (row[5] || 'A').toUpperCase() as 'A' | 'B' | 'C' | 'D',
      subject: row[6] || 'General'
    }));
  } catch (error) {
    console.error("Question Fetch Error:", error);
    return [];
  }
}
