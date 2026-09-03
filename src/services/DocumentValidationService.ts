import { DocumentItem, DocValidationStatus } from "../types/domain";

export class DocumentValidationService {
  /**
   * Validate uploaded file format & size against Rwandan government standards
   */
  static validateFileConstraints(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf")) {
      return {
        valid: false,
        error: "Invalid file format. Please upload a PDF, JPG, or PNG document.",
      };
    }

    if (file.size > 15 * 1024 * 1024) {
      return {
        valid: false,
        error: "File size exceeds 15 MB limit for Irembo/RDB submission.",
      };
    }

    return { valid: true };
  }

  /**
   * Determine document institution based on title or filename
   */
  static inferInstitution(fileName: string): string {
    const lower = fileName.toLowerCase();
    if (lower.includes("id") || lower.includes("indangamuntu") || lower.includes("nida") || lower.includes("birth")) {
      return "NIDA";
    }
    if (lower.includes("tin") || lower.includes("tax") || lower.includes("rra") || lower.includes("vat")) {
      return "RRA";
    }
    if (lower.includes("business") || lower.includes("company") || lower.includes("rdb") || lower.includes("name")) {
      return "RDB";
    }
    if (lower.includes("rssb") || lower.includes("mutuelle") || lower.includes("pension") || lower.includes("insurance")) {
      return "RSSB";
    }
    if (lower.includes("land") || lower.includes("title") || lower.includes("upi")) {
      return "National Land Authority";
    }
    return "Irembo Gov";
  }

  /**
   * Format bytes to readable size
   */
  static formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
}
