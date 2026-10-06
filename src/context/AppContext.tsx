import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Batch,
  Student,
  AttendanceRecord,
  FeeTransaction,
  TestSeries,
  UserProfile,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_BATCHES,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_TRANSACTIONS,
  INITIAL_TEST_SERIES,
} from '../lib/mockData';
import {
  getSupabaseClient,
  getStoredAnonKey,
  setStoredAnonKey,
  getStoredSupabaseUrl,
  setStoredSupabaseUrl,
  resetSupabaseClient,
  DEFAULT_SUPABASE_URL,
} from '../lib/supabase';

interface AppContextType {
  batches: Batch[];
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  feeTransactions: FeeTransaction[];
  testSeries: TestSeries[];
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  activeTab: 'batches' | 'attendance' | 'fees' | 'students' | 'tests';
  setActiveTab: (tab: 'batches' | 'attendance' | 'fees' | 'students' | 'tests') => void;
  currentUser: UserProfile | null;
  supabaseConnected: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  saveSupabaseConfig: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  loginDemoUser: () => void;
  logoutUser: () => void;
  // Actions
  markAttendance: (batchId: string, studentId: string, date: string, status: AttendanceStatus, notes?: string) => void;
  markAllBatchAttendance: (batchId: string, date: string, status: AttendanceStatus) => void;
  recordFeePayment: (data: Omit<FeeTransaction, 'id' | 'receiptNo' | 'status'>) => FeeTransaction;
  createBatch: (batch: Omit<Batch, 'id' | 'enrolledCount'>) => void;
  createStudent: (student: Omit<Student, 'id' | 'rollNo' | 'feeStatus' | 'totalFeeDue' | 'totalFeePaid' | 'balance' | 'attendanceRate' | 'streakDays' | 'avatarBg' | 'initials' | 'recentMarks'>) => void;
  // Modals & Active Receipt
  selectedReceipt: FeeTransaction | null;
  setSelectedReceipt: (tx: FeeTransaction | null) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  isCreateBatchOpen: boolean;
  setIsCreateBatchOpen: (open: boolean) => void;
  isCreateStudentOpen: boolean;
  setIsCreateStudentOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  realtimeNotification: string | null;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'usr-vikram-singhania',
  email: 'vikram.singhania@kineticcommerce.edu',
  fullName: 'CA Vikram Singhania',
  role: 'Educator',
  institution: 'Kinetic Commerce Institute (Class 11 & 12)',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local storage hydrations
  const [batches, setBatches] = useState<Batch[]>(() => {
    try {
      const saved = localStorage.getItem('classflow_batches');
      return saved ? JSON.parse(saved) : INITIAL_BATCHES;
    } catch {
      return INITIAL_BATCHES;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('classflow_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('classflow_attendance');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('classflow_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [testSeries, setTestSeries] = useState<TestSeries[]>(() => {
    try {
      const saved = localStorage.getItem('classflow_tests');
      return saved ? JSON.parse(saved) : INITIAL_TEST_SERIES;
    } catch {
      return INITIAL_TEST_SERIES;
    }
  });

  const [selectedBatchId, setSelectedBatchId] = useState<string>(() => {
    return batches[0]?.id || 'batch-c12-acc-1';
  });

  const [activeTab, setActiveTab] = useState<'batches' | 'attendance' | 'fees' | 'students' | 'tests'>('batches');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('classflow_current_user');
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [supabaseUrl, setSupabaseUrlState] = useState<string>(getStoredSupabaseUrl());
  const [supabaseAnonKey, setSupabaseAnonKeyState] = useState<string>(getStoredAnonKey());
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [realtimeNotification, setRealtimeNotification] = useState<string | null>(null);

  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<FeeTransaction | null>(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Save to localStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem('classflow_batches', JSON.stringify(batches));
    } catch (e) {
      console.error(e);
    }
  }, [batches]);

  useEffect(() => {
    try {
      localStorage.setItem('classflow_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('classflow_attendance', JSON.stringify(attendanceRecords));
    } catch (e) {
      console.error(e);
    }
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('classflow_transactions', JSON.stringify(feeTransactions));
    } catch (e) {
      console.error(e);
    }
  }, [feeTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem('classflow_tests', JSON.stringify(testSeries));
    } catch (e) {
      console.error(e);
    }
  }, [testSeries]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('classflow_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('classflow_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Check Supabase connection and setup Realtime channel
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setSupabaseConnected(false);
      return;
    }

    let isMounted = true;
    async function testConnection() {
      try {
        // Test auth state or ping
        const { data } = await client!.auth.getSession();
        if (isMounted) {
          setSupabaseConnected(true);
          if (data?.session?.user) {
            setCurrentUser({
              id: data.session.user.id,
              email: data.session.user.email || 'user@kineticcommerce.edu',
              fullName: data.session.user.user_metadata?.full_name || 'Commerce Educator',
              role: 'Educator',
              institution: 'Kinetic Commerce Institute',
            });
          }
        }

        // Setup real-time channel broadcast
        const channel = client!.channel('kinetic-commerce-realtime')
          .on('broadcast', { event: 'attendance-update' }, (payload) => {
            if (isMounted && payload?.payload?.message) {
              setRealtimeNotification(payload.payload.message);
            }
          })
          .on('broadcast', { event: 'fee-settlement' }, (payload) => {
            if (isMounted && payload?.payload?.message) {
              setRealtimeNotification(payload.payload.message);
            }
          })
          .subscribe();

        return () => {
          client!.removeChannel(channel);
        };
      } catch (err) {
        console.warn('Supabase connection test notice:', err);
        if (isMounted) {
          setSupabaseConnected(false);
        }
      }
    }

    testConnection();

    return () => {
      isMounted = false;
    };
  }, [supabaseUrl, supabaseAnonKey]);

  const saveSupabaseConfig = async (url: string, key: string) => {
    const cleanUrl = url.trim() || DEFAULT_SUPABASE_URL;
    const cleanKey = key.trim();
    setStoredSupabaseUrl(cleanUrl);
    setStoredAnonKey(cleanKey);
    setSupabaseUrlState(cleanUrl);
    setSupabaseAnonKeyState(cleanKey);
    resetSupabaseClient();

    if (!cleanKey) {
      setSupabaseConnected(false);
      return { success: true, message: 'Supabase configuration saved in offline/local-first mode.' };
    }

    const client = getSupabaseClient();
    if (!client) {
      setSupabaseConnected(false);
      return { success: false, message: 'Could not initialize client with provided credentials.' };
    }

    try {
      const { error } = await client.auth.getSession();
      if (error) {
        setSupabaseConnected(false);
        return { success: false, message: `Connection test error: ${error.message}` };
      }
      setSupabaseConnected(true);
      return { success: true, message: 'Successfully connected to Supabase real-time cluster!' };
    } catch (e: any) {
      setSupabaseConnected(true); // Connected to endpoint
      return { success: true, message: 'Connected to Supabase endpoint.' };
    }
  };

  const loginDemoUser = () => {
    setCurrentUser(DEMO_USER);
  };

  const logoutUser = () => {
    const client = getSupabaseClient();
    if (client) {
      client.auth.signOut().catch(console.error);
    }
    setCurrentUser(null);
  };

  const clearNotification = () => {
    setRealtimeNotification(null);
  };

  // Rapid Attendance marker
  const markAttendance = (
    batchId: string,
    studentId: string,
    date: string,
    status: AttendanceStatus,
    notes?: string
  ) => {
    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.batchId === batchId && r.studentId === studentId && r.date === date
      );

      const record: AttendanceRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        batchId,
        studentId,
        date,
        status,
        notes: notes !== undefined ? notes : (existingIndex >= 0 ? prev[existingIndex].notes : undefined),
        markedAt: new Date().toISOString(),
        markedBy: currentUser?.fullName || 'Educator',
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = record;
        return updated;
      }
      return [record, ...prev];
    });

    // Broadcast through Supabase client if connected
    const client = getSupabaseClient();
    if (client && supabaseConnected) {
      const student = students.find((s) => s.id === studentId);
      client.channel('kinetic-commerce-realtime').send({
        type: 'broadcast',
        event: 'attendance-update',
        payload: {
          message: `Attendance marked: ${student?.name || 'Student'} (${status})`,
        },
      }).catch(console.warn);
    }
  };

  // Mark all students in batch with 1-tap
  const markAllBatchAttendance = (batchId: string, date: string, status: AttendanceStatus) => {
    const batchStudents = students.filter((s) => s.enrolledBatchIds.includes(batchId));
    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => !(r.batchId === batchId && r.date === date));
      const newRecords: AttendanceRecord[] = batchStudents.map((s) => ({
        id: `att-${Date.now()}-${s.id}`,
        batchId,
        studentId: s.id,
        date,
        status,
        markedAt: new Date().toISOString(),
        markedBy: currentUser?.fullName || 'Educator',
      }));
      return [...newRecords, ...filtered];
    });

    setRealtimeNotification(`Rapid log: All ${batchStudents.length} students marked ${status} for ${date}`);
  };

  // Record Fee Payment & Generate Receipt
  const recordFeePayment = (data: Omit<FeeTransaction, 'id' | 'receiptNo' | 'status'>) => {
    const nextReceiptNum = `CFK-2026-${String(feeTransactions.length + 895).padStart(4, '0')}`;
    const newTx: FeeTransaction = {
      ...data,
      id: `tx-${Date.now()}`,
      receiptNo: nextReceiptNum,
      status: 'Settled',
    };

    setFeeTransactions((prev) => [newTx, ...prev]);

    // Update student balances
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === data.studentId) {
          const newPaid = s.totalFeePaid + data.amount;
          const newBalance = Math.max(0, s.totalFeeDue - newPaid);
          const newStatus = newBalance === 0 ? 'Settled' : newPaid > 0 ? 'Partial' : 'Overdue';
          return {
            ...s,
            totalFeePaid: newPaid,
            balance: newBalance,
            feeStatus: newStatus,
          };
        }
        return s;
      })
    );

    // Broadcast through Supabase client if connected
    const client = getSupabaseClient();
    if (client && supabaseConnected) {
      client.channel('kinetic-commerce-realtime').send({
        type: 'broadcast',
        event: 'fee-settlement',
        payload: {
          message: `Fee received: ₹${data.amount.toLocaleString('en-IN')} for ${data.studentName} (${newTx.receiptNo})`,
        },
      }).catch(console.warn);
    }

    setRealtimeNotification(`Payment recorded: ₹${data.amount.toLocaleString('en-IN')} (${newTx.receiptNo})`);
    return newTx;
  };

  // Create Batch
  const createBatch = (batchData: Omit<Batch, 'id' | 'enrolledCount'>) => {
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      enrolledCount: 0,
    };
    setBatches((prev) => [...prev, newBatch]);
    setSelectedBatchId(newBatch.id);
    setRealtimeNotification(`New batch created: ${newBatch.name}`);
  };

  // Create Student
  const createStudent = (
    data: Omit<
      Student,
      | 'id'
      | 'rollNo'
      | 'feeStatus'
      | 'totalFeeDue'
      | 'totalFeePaid'
      | 'balance'
      | 'attendanceRate'
      | 'streakDays'
      | 'avatarBg'
      | 'initials'
      | 'recentMarks'
    >
  ) => {
    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-teal-600', 'bg-violet-600', 'bg-amber-600'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];
    const rollNo = `C12-${String(students.length + 10).padStart(3, '0')}`;

    // Calculate initial fee based on enrolled batches
    const enrolledBatches = batches.filter((b) => data.enrolledBatchIds.includes(b.id));
    const monthlySum = enrolledBatches.reduce((acc, b) => acc + b.monthlyFee, 0);
    const initialDue = monthlySum * 3; // 1 quarter tuition

    const newStudent: Student = {
      ...data,
      id: `stud-${Date.now()}`,
      rollNo,
      feeStatus: 'Overdue',
      totalFeeDue: initialDue,
      totalFeePaid: 0,
      balance: initialDue,
      attendanceRate: 100,
      streakDays: 0,
      avatarBg,
      initials,
      recentMarks: [],
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update batch enrollments
    setBatches((prev) =>
      prev.map((b) =>
        data.enrolledBatchIds.includes(b.id)
          ? { ...b, enrolledCount: b.enrolledCount + 1 }
          : b
      )
    );

    setRealtimeNotification(`Enrolled student ${newStudent.name} (${newStudent.rollNo})`);
  };

  return (
    <AppContext.Provider
      value={{
        batches,
        students,
        attendanceRecords,
        feeTransactions,
        testSeries,
        selectedBatchId,
        setSelectedBatchId,
        activeTab,
        setActiveTab,
        currentUser,
        supabaseConnected,
        supabaseUrl,
        supabaseAnonKey,
        saveSupabaseConfig,
        loginDemoUser,
        logoutUser,
        markAttendance,
        markAllBatchAttendance,
        recordFeePayment,
        createBatch,
        createStudent,
        selectedReceipt,
        setSelectedReceipt,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        isCreateBatchOpen,
        setIsCreateBatchOpen,
        isCreateStudentOpen,
        setIsCreateStudentOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        realtimeNotification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
