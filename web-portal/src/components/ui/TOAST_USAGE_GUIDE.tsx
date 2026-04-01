/**
 * TOAST SYSTEM USAGE GUIDE
 * 
 * This file demonstrates how to use the new Toast Notification System
 * in your HireVia web portal.
 */

import { useToast } from '@/lib/toast-context';

/**
 * Example 1: Basic Toast Usage in a Component
 */
export function ExampleBasicToast() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Candidate Moved',
      description: 'Elena Rostova moved to Shortlisted',
    });
  };

  const handleError = () => {
    addToast({
      type: 'error',
      title: 'Operation Failed',
      description: 'Could not move candidate. Please try again.',
      duration: 5000, // 5 seconds
    });
  };

  const handleWarning = () => {
    addToast({
      type: 'warning',
      title: 'Warning',
      description: 'This action cannot be undone',
    });
  };

  const handleInfo = () => {
    addToast({
      type: 'info',
      title: 'Info',
      description: 'Interview scheduled for tomorrow at 2 PM',
    });
  };

  return (
    <div className="space-y-2">
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}

/**
 * Example 2: Toast with Long-Running Operation
 */
export function ExampleAsyncToast() {
  const { addToast } = useToast();

  const handleMoveCandidate = async () => {
    try {
      addToast({
        type: 'info',
        title: 'Moving candidate...',
        duration: 0, // Don't auto-dismiss
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addToast({
        type: 'success',
        title: 'Candidate Moved Successfully!',
        description: 'Elena Rostova is now in the Shortlisted stage',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Move Candidate',
        description: 'Please try again or contact support',
      });
    }
  };

  return <button onClick={handleMoveCandidate}>Move Candidate</button>;
}

/**
 * Example 3: Integration with Drag & Drop (Candidates Page)
 * 
 * In your candidates page or Kanban component:
 */
export function ExampleDragDropIntegration() {
  const { addToast } = useToast();

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const candidateName = 'Elena Rostova'; // Get from actual data
    const newStatus = destination.droppableId; // e.g., 'shortlisted'

    addToast({
      type: 'success',
      title: `Moved to ${newStatus}`,
      description: `${candidateName} is now ${newStatus}`,
    });
  };

  return null;
}

/**
 * INTEGRATION CHECKLIST:
 * 
 * ✅ 1. Toast System is already set up in your app
 *       - ToastProvider wraps the app in AppShell.tsx
 *       - Toaster component renders all toasts
 * 
 * ✅ 2. Use in any client component:
 *       - Import: import { useToast } from '@/lib/toast-context'
 *       - Call: const { addToast } = useToast();
 *       - Show: addToast({ type: 'success', title: 'Done!' })
 * 
 * 📝 3. Types available:
 *       - 'success' (green checkmark)
 *       - 'error' (red alert circle)
 *       - 'warning' (orange alert triangle)
 *       - 'info' (blue info icon)
 * 
 * ⏱️  4. Duration:
 *       - Default: 4000ms (4 seconds)
 *       - Set to 0 to prevent auto-dismiss
 *       - Set custom value in milliseconds
 * 
 * 🎯 PLACES TO ADD TOASTS:
 * 
 * 1. Candidates Page (drag operations):
 *    - When candidate moves to new status column
 *    - When candidate is deleted
 *    - When resume is uploaded
 * 
 * 2. Jobs Page (CRUD operations):
 *    - When job is created
 *    - When job is updated
 *    - When job is closed/deleted
 * 
 * 3. Interviews Page (scheduling):
 *    - When interview is scheduled
 *    - When interview is rescheduled
 *    - When interview is confirmed
 * 
 * 4. Auth Pages:
 *    - Login/signup errors
 *    - Password reset confirmation
 * 
 * 5. Settings Page:
 *    - Settings saved
 *    - Profile updated
 */
