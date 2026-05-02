import { db } from "@/lib/db";

/**
 * Generate a unique registration number for PPDB.
 * Format: PPDB-YYYY-XXXX (where XXXX is a sequence)
 */
export async function generateRegistrationNumber(tenantId: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `PPDB-${currentYear}-`;

  // Find the latest registration number for this tenant and year
  const latestPendaftar = await db.pendaftarPpdb.findFirst({
    where: {
      tenantId,
      noPendaftaran: {
        startsWith: prefix,
      },
    },
    orderBy: {
      noPendaftaran: "desc",
    },
    select: {
      noPendaftaran: true,
    },
  });

  let nextNumber = 1;
  if (latestPendaftar) {
    const lastPart = latestPendaftar.noPendaftaran.split("-").pop();
    if (lastPart) {
      nextNumber = parseInt(lastPart, 10) + 1;
    }
  }

  // Format with leading zeros (4 digits)
  const sequence = nextNumber.toString().padStart(4, "0");
  return `${prefix}${sequence}`;
}

/**
 * Generate a Student Identification Number (NIS).
 * This can be customized per school.
 * Default: YYYYNNNN (Year + 4 digit sequence)
 */
export async function generateNIS(tenantId: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = currentYear.toString();

  const latestStudent = await db.student.findFirst({
    where: {
      tenantId,
      nis: {
        startsWith: yearPrefix,
      },
    },
    orderBy: {
      nis: "desc",
    },
    select: {
      nis: true,
    },
  });

  let nextNumber = 1;
  if (latestStudent && latestStudent.nis) {
    const sequencePart = latestStudent.nis.substring(yearPrefix.length);
    nextNumber = parseInt(sequencePart, 10) + 1;
  }

  const sequence = nextNumber.toString().padStart(4, "0");
  return `${yearPrefix}${sequence}`;
}
