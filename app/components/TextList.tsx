'use client';

import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

interface Text {
  id: string;
  content: string;
  createdAt: Date;
}

export default function TextList() {
  const { user } = useAuth();
  const [texts, setTexts] = useState<Text[]>([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Create query with ordering
    const q = query(
      collection(db, 'texts'),
      orderBy('createdAt', 'desc')
    );
    
    // Set up real-time subscription
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const texts = snapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().content,
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setTexts(texts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching texts:", error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newText.trim()) return;

    try {
      await addDoc(collection(db, 'texts'), {
        content: newText.trim(),
        createdAt: new Date(),
        userId: user.uid
      });
      setNewText('');
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

  const handleDelete = async (textId: string) => {
    try {
      await deleteDoc(doc(db, 'texts', textId));
    } catch (error) {
      console.error('Error deleting text:', error);
    }
  };

  if (!user) return <div>Please sign in to view texts.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter new text"
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!newText.trim()}
          >
            Add Text
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Text List</h2>
      {texts.length === 0 ? (
        <p className="text-gray-500">No texts yet. Add one above!</p>
      ) : (
        <ul className="space-y-4">
          {texts.map((text) => (
            <li 
              key={text.id}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between items-center"
            >
              <div>
                <p>{text.content}</p>
                <p className="text-sm text-gray-500">
                  {text.createdAt?.toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(text.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 