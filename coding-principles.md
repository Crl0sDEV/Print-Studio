# 🗒️ CODING PRINCIPLES AND PRACTICAL GUIDELINES
**Stack Version:** Next.js 16 + React 19 + TypeScript 5 + Tailwind v4 + Supabase SSR + Dexie

---

## 💡 CORE DESIGN PRINCIPLES

### ➡️ DRY (Don't Repeat Yourself)
*   **Rule:** Huwag mong uulit-ulitin ang parehong logic o UI block. Kung na-copy-paste mo, i-extract agad sa isang function o maliit na component.
*   **BAD (Repetitive Tailwind blocks):**
    ```tsx
    // File A & File B copy-pasted layout
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">Card A</div>
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">Card B</div>
    ```
*   **GOOD (Reusable Card Component with Class Variance Authority):**
    ```tsx
    import { cva, type VariantProps } from "class-variance-authority";
    import { cn } from "@/lib/utils";

    const cardVariants = cva("rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-950", {
      variants: { variant: { default: "border-neutral-200 dark:border-neutral-800", error: "border-destructive" } },
      defaultVariants: { variant: "default" }
    });

    export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}
    export const Card = ({ className, variant, ...props }: CardProps) => (
      <div className={cn(cardVariants({ variant }), className)} {...props} />
    );
    ```

### ➡️ KISS (Keep It Simple, Stupid)
*   **Rule:** Simplehan ang execution logic. Huwag mag-nested if-else kung kayang dumaan sa declarative array methods o primitive guard clauses.
*   **BAD (Nested branching conditional logic):**
    ```typescript
    function getPrintJobStatus(job) {
      if (job) {
        if (job.status === "completed") return "Done";
        else if (job.isProcessing) return "Printing";
        else return "Queued";
      } else {
        return "Unknown";
      }
    }
    ```
*   **GOOD (Guard Clauses & Early Return):**
    ```typescript
    type PrintJob = { status: "completed" | "failed"; isProcessing: boolean };

    function getPrintJobStatus(job?: PrintJob): string {
      if (!job) return "Unknown";
      if (job.status === "completed") return "Done";
      return job.isProcessing ? "Printing" : "Queued";
    }
    ```

### ➡️ YAGNI (You Aren't Gonna Need It)
*   **Rule:** Huwag magsulat ng code o magdagdag ng multi-tenant sync database structures para sa mga "baka kailanganin bukas" na features. I-code lang ang requirements ngayon nang malinis at scalable.

---

## 🔎 ARCHITECTURE & BOUNDARY PATTERNS

### ➡️ Server vs. Client Component Boundaries (Next.js App Router)
*   **Server Components (Default):** Lahat ng data access mula sa Supabase SSR o direct library tasks gaya ng `googleapis` ay dapat manatili sa Server Components. Bawal mag-import ng server modules sa client files.
*   **Client Components (`'use client'`):** Gamitin lang kapag may interactivity (e.g., canvas handling para sa `jspdf`, background removal clicks, `recharts` renders, at local device synchronization gamit ang `dexie`). Panatilihin itong nasa pinakadulo (leaves) ng component tree.

### ➡️ Separation of Concerns (SoC) in State & Sync
*   **Data Access Layer (DAL):** Ihiwalay ang network data aggregation, local fallback, at state synchronization.
*   **Folder Mapping Standard (Colocation Layout):**
    ```
    src/features/printing/
    ├── actions.ts          # Validated Server Actions (Supabase mutations)
    ├── hooks/
    │   └── useSync.ts      # Custom Client hook handling Dexie to Supabase pooling
    ├── components/
    │   ├── print-panel.tsx # Interactivity Client UI
    │   └── print-stats.tsx # Analytical presentation using Recharts
    └── schemas.ts          # Zod structures sharing verification forms
    ```

---

## 🛠️ PRACTICAL CODING GUIDELINES

### ➡️ 1. Strictly Validated Server Actions
Huwag kailanman magtitiwala sa data na pinapasa mula sa Client Component browser layer. Palaging gamitin ang `next-safe-action` na may kasamang `zod` validation para sa bawat mutasyon sa server layer upang maiwasan ang unvalidated parameter manipulations.
*   **GOOD PRACTICE:**
    ```typescript
    // src/features/printing/actions.ts
    "use server";
    import { createSafeActionClient } from "next-safe-action";
    import { z } from "zod";
    import { createClient } from "@/utils/supabase/server";

    export const actionClient = createSafeActionClient();

    const createPrintJobSchema = z.object({
      fileName: z.string().min(1, "File name is required"),
      pagesCount: z.number().positive(),
      pdfDataUrl: z.string().url()
    });

    export const createPrintJobAction = actionClient
      .schema(createPrintJobSchema)
      .action(async ({ parsedInput: { fileName, pagesCount, pdfDataUrl } }) => {
        const supabase = await createClient();
        
        const { data, error } = await supabase
          .from("print_jobs")
          .insert([{ file_name: fileName, pages_count: pagesCount, url: pdfDataUrl }])
          .select()
          .single();

        if (error) throw new Error("Database insertion failed");
        return { success: true, jobId: data.id };
      });
    ```

### ➡️ 2. React 19 Declarative State & Progress Form Management
Iwasan ang `useEffect` spaghetti para sa submission lifecycles. Gamitin ang bagong `useActionState` at `useFormStatus` hooks ng React 19 kasabay ng React Hook Form para sa mabilis at tuluy-tuloy na transition processing.
*   **GOOD PRACTICE:**
    ```tsx
    "use client";
    import { useActionState } from "react";
    import { useForm } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { createPrintJobAction } from "../actions";
    import { printJobSchema } from "../schemas";

    export function PrintOrderForm() {
      const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(printJobSchema)
      });

      // React 19 action state infrastructure
      const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const rawData = Object.fromEntries(formData);
        const result = await createPrintJobAction({
          fileName: rawData.fileName as string,
          pagesCount: Number(rawData.pagesCount),
          pdfDataUrl: rawData.pdfDataUrl as string
        });
        return result?.data ?? null;
      }, null);

      return (
        <form action={formAction} className="space-y-4">
          <input {...register("fileName")} name="fileName" className="input" />
          {errors.fileName && <p className="text-red-500">{errors.fileName.message?.toString()}</p>}
          
          <button type="submit" disabled={isPending} className="btn">
            {isPending ? "Processing Layout..." : "Submit Order"}
          </button>
        </form>
      );
    }
    ```

### ➡️ 3. Strict TypeScript Guarding & Zero `any` Allowance
*   Bawal gumamit ng explicit o implicit `any`. Kung hindi sigurado sa shape ng data na galing sa panlabas na module (e.g., raw canvas outputs o custom printer telemetry), markahan ito bilang `unknown` at patakbuhin sa isang interface type guard o zod parse block bago ipasa sa system context.
*   **BAD:** `const handleBlob = (data: any) => { console.log(data.name); }`
*   **GOOD:**
    ```typescript
    interface VerifiedBlobMetadata { name: string; size: number }
    
    function isBlobMetadata(blob: unknown): blob is VerifiedBlobMetadata {
      return typeof blob === "object" && blob !== null && "name" in blob && "size" in blob;
    }
    ```

### ➡️ 4. Safe Offline-First Isolation (Dexie + Supabase Pooling)
Para maiwasan ang data corruption kapag nawalan ng koneksyon ang user habang nagproproseso ng layout, panatilihing hiwalay at protektado ang offline mutations.
*   Isulat muna ang bawat transactional modification sa local storage (`dexie` IndexedDB).
*   Gumamit ng worker queue o custom sync pooling upang ligtas na mai-push ang offline layout entries papuntang Supabase table kapag nakumpirmang online na ulit ang user navigator.

---

## 📊 REFACTORING & COMPLEXITY CHECKPOINT

### ➡️ Ang "200 Lines Rule" sa Single Files
Kapag ang isang component o system hook hook file ay lumagpas na sa **200 lines**, senyales na ito na lumalabag ka na sa *Single Responsibility Principle*. 
*   **Action Plan:** I-extract ang nested computational utilities papunta sa isang dedicated sub-module file, at hatiin ang mabibigat na conditional presentation blocks sa mas maliliit na compound layout elements.

### ➡️ Iwasan ang mga Kilalang Anti-Patterns
*   **Magic Configuration String Passings:** Huwag maglagay ng static variables nang walang protektadong object definition wrapper.
    *   *Mali:* `if (dpiValue > 600) { ... }`
    *   *Tama:* `const MAX_HIGH_RES_DPI = 600; if (dpiValue > MAX_HIGH_RES_DPI) { ... }`
*   **State Variable Mutation Directives:** Bawal baguhin ang React states sa pamamagitan ng array mutations.
    *   *Mali:* `queueList.push(newItem); setQueueList(queueList);`
    *   *Tama:* `setQueueList((prev) => [...prev, newItem]);`

---

## 📈 PRE-COMMIT CRITICAL CHECKLIST
Bago mo patakbuhin ang `git commit` o i-push ang code sa main deployment branch, siguraduhing pasado ang mga sumusunod na automated validation steps:

- [ ] **TypeScript Compile Pass:** Walang naiwang typescript compilation errors o generic warnings sa console terminal.
- [ ] **Strict Linter Clear:** Nakapasa sa built-in strict parsing command (`npm run lint`).
- [ ] **No `any` Escapes:** Walang nakalusot na dynamic fallback rules (`any`) sa loob ng functional payloads.
