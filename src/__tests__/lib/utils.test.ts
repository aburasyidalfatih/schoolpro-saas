import { describe, it, expect } from "vitest"
import { cn, formatCurrency, formatDate, generateSlug, truncate } from "@/lib/utils"

describe("cn (classnames merge)", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("merges conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})

describe("formatCurrency", () => {
  it("formats IDR currency", () => {
    const result = formatCurrency(150000)
    expect(result).toContain("150.000")
  })

  it("handles zero", () => {
    const result = formatCurrency(0)
    expect(result).toContain("0")
  })

  it("handles large numbers", () => {
    const result = formatCurrency(1500000)
    expect(result).toContain("1.500.000")
  })
})

describe("formatDate", () => {
  it("formats date string", () => {
    const result = formatDate("2024-01-15")
    expect(result).toContain("2024")
    expect(result).toContain("15")
  })

  it("formats Date object", () => {
    const result = formatDate(new Date("2024-06-01"))
    expect(result).toContain("2024")
  })
})

describe("generateSlug", () => {
  it("converts text to slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world")
  })

  it("removes special characters", () => {
    expect(generateSlug("PT. Maju Jaya!")).toBe("pt-maju-jaya")
  })

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("--test--")).toBe("test")
  })

  it("handles multiple spaces", () => {
    expect(generateSlug("hello   world")).toBe("hello-world")
  })
})

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...")
  })

  it("does not truncate short strings", () => {
    expect(truncate("Hi", 10)).toBe("Hi")
  })

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello")
  })
})
