export type Subject = 'Accountancy' | 'Economics' | 'Business Studies' | 'Applied Mathematics';
export type Grade = 'Class 11' | 'Class 12';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type PaymentMode = 'UPI / QR' | 'Net Banking' | 'Cash' | 'Cheque';
export type FeeStatus = 'Settled' | 'Partial' | 'Overdue';

export interface Batch {
  id: string;
  name: string;
  subject: Subject;
  grade: Grade;
  scheduleDays: string[];
  timeSlot: string;
  room: string;
  instructor: string;
  totalSeats: number;
  enrolledCount: number;
  monthlyFee: number;
  syllabusCompletion: number;
  currentChapter: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  phone: string;
  parentPhone: string;
  parentName: string;
  email: string;
  enrolledBatchIds: string[];
  feeStatus: FeeStatus;
  totalFeeDue: number;
  totalFeePaid: number;
  balance: number;
  attendanceRate: number;
  streakDays: number;
  avatarBg: string;
  initials: string;
  recentMarks: {
    testName: string;
    marks: number;
    totalMarks: number;
    date: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  markedAt: string;
  markedBy: string;
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  batchId: string;
  batchName: string;
  amount: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  transactionRef: string;
  installmentPeriod: string;
  status: 'Settled' | 'Pending Verification' | 'Failed';
  balanceRemaining: number;
}

export interface TestScore {
  studentId: string;
  marksObtained: number;
  remarks?: string;
}

export interface TestSeries {
  id: string;
  batchId: string;
  testTitle: string;
  date: string;
  maxMarks: number;
  averageScore: number;
  highestScore: number;
  scores: TestScore[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'Educator' | 'Administrator' | 'Student';
  institution: string;
}
