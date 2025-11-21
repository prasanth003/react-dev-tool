import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock chrome API
// Mock chrome API
const mockChrome = {
    tabs: {
        query: vi.fn((_queryInfo, callback) => {
            callback([{ id: 123 }]);
        }),
        sendMessage: vi.fn(),
    },
    runtime: {
        onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
};

(globalThis as any).chrome = mockChrome;

describe('App Component', () => {
    it('renders the Start button initially', () => {
        render(<App />);
        expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('sends START_MONITORING message when Start is clicked', () => {
        render(<App />);
        const startButton = screen.getByText('Start');
        fireEvent.click(startButton);

        expect(mockChrome.tabs.sendMessage).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ type: 'START_MONITORING' })
        );
    });

    it('shows "Please click Start to begin monitoring" when not monitoring', () => {
        render(<App />);
        expect(screen.getByText('Please click Start to begin monitoring')).toBeInTheDocument();
    });
});
