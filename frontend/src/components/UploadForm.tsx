import { useRef, useState, type FormEvent } from 'react'

type UploadFormProps = {
  busy: boolean
  onAnalyze: (file: File, jobDescription: string) => Promise<void>
}

export default function UploadForm({ busy, onAnalyze }: UploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (jobDescription.trim().length < 20) {
      setError('Enter a job description of at least 20 characters.')
      return
    }
    if (!file) {
      setError('Choose a PDF or DOCX resume first.')
      return
    }
    setError('')
    try {
      await onAnalyze(file, jobDescription)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Resume analysis failed.')
    }
  }

  function chooseFile(candidate?: File) {
    if (!candidate) return
    if (candidate.size > 5 * 1024 * 1024) {
      setFile(null)
      setError('This file is larger than 5 MB. Choose a smaller resume.')
      return
    }
    if (!/\.(pdf|docx)$/i.test(candidate.name)) {
      setError('This file type is not supported. Choose a PDF or DOCX.')
      return
    }
    setFile(candidate)
    setError('')
  }

  return (
    <form className="upload-form" onSubmit={submit}>
      <button
        className={`drop-zone${file ? ' has-file' : ''}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          chooseFile(event.dataTransfer.files[0])
        }}
      >
        <span className="upload-mark" aria-hidden="true">↑</span>
        <span className="drop-title">{file ? file.name : 'Choose a resume to review'}</span>
        <span className="drop-note">PDF or DOCX · up to 5 MB</span>
      </button>
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => chooseFile(event.target.files?.[0])}
      />
      <label className="field-label" htmlFor="job-description">Job description <span>{jobDescription.trim().length}/20 min</span></label>
      <textarea
        id="job-description"
        rows={5}
        minLength={20}
        required
        placeholder="Paste a job description to check for relevant keywords..."
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="analyze-button" type="submit" disabled={busy || jobDescription.trim().length < 20 || !file}>
        {busy ? 'Reviewing resume…' : 'Analyze resume'}
        {!busy && <span aria-hidden="true">↗</span>}
      </button>
    </form>
  )
}