// Fixing the journal entry creation logic
if (!entry.title || !entry.content) {
    throw new Error('Title and content are required.');
}