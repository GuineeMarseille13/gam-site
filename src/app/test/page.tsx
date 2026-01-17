'use client'

import { useState } from 'react'
import { Page, Section } from '@/lib/generated/prisma/enums'
import { useImages } from '@/hooks/api/use-images'

export default function TestPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [page, setPage] = useState<Page>(Page.HOME)
  const [section, setSection] = useState<Section>(Section.CAROUSEL)
  const [imageTitle, setImageTitle] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [imageResult, setImageResult] = useState<any>(null)
  const [videoResult, setVideoResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      setError('Veuillez sélectionner une image')
      return
    }

    setImageLoading(true)
    setError(null)
    setImageResult(null)

    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('page', page)
      formData.append('section', section)
      if (imageTitle) formData.append('title', imageTitle)
      formData.append('alt', imageTitle || imageFile.name)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setImageResult(data)
      setImageFile(null)
      setImageTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setImageLoading(false)
    }
  }

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoFile) {
      setError('Veuillez sélectionner une vidéo')
      return
    }

    setVideoLoading(true)
    setError(null)
    setVideoResult(null)

    try {
      const formData = new FormData()
      formData.append('file', videoFile)
      formData.append('page', page)
      formData.append('section', section)
      if (videoTitle) formData.append('title', videoTitle)

      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setVideoResult(data)
      setVideoFile(null)
      setVideoTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setVideoLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Test Upload Cloudinary</h1>

        {/* Paramètres communs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Paramètres communs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page</label>
              <select
                value={page}
                onChange={(e) => setPage(e.target.value as Page)}
                className="w-full p-2 border rounded"
              >
                {Object.values(Page).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as Section)}
                className="w-full p-2 border rounded"
              >
                {Object.values(Section).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Image */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fichier image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
                disabled={imageLoading}
              />
              {imageFile && (
                <p className="text-sm text-gray-600 mt-1">
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Titre (optionnel)
              </label>
              <input
                type="text"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Titre de l'image"
                className="w-full p-2 border rounded"
                disabled={imageLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!imageFile || imageLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {imageLoading ? 'Upload en cours...' : 'Uploader l\'image'}
            </button>
          </form>

          {imageResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Image uploadée avec succès !
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {imageResult.image.id}</p>
                <p><strong>URL:</strong> 
                  <a href={imageResult.image.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                    {imageResult.image.url}
                  </a>
                </p>
                <p><strong>Dimensions:</strong> {imageResult.image.width} x {imageResult.image.height}</p>
                <p><strong>Taille:</strong> {(imageResult.image.size / 1024).toFixed(2)} KB</p>
                <div className="mt-2">
                  <img 
                    src={imageResult.image.url} 
                    alt={imageResult.image.alt || ''}
                    className="max-w-xs rounded border"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Video */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload Vidéo</h2>
          <form onSubmit={handleVideoUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fichier vidéo
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded"
                disabled={videoLoading}
              />
              {videoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Titre (optionnel)
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Titre de la vidéo"
                className="w-full p-2 border rounded"
                disabled={videoLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!videoFile || videoLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {videoLoading ? 'Upload en cours...' : 'Uploader la vidéo'}
            </button>
          </form>

          {videoResult && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Vidéo uploadée avec succès !
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {videoResult.video.id}</p>
                <p><strong>URL:</strong> 
                  <a href={videoResult.video.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                    {videoResult.video.url}
                  </a>
                </p>
                <p><strong>Durée:</strong> {videoResult.video.duration}s</p>
                <p><strong>Taille:</strong> {(videoResult.video.size / 1024 / 1024).toFixed(2)} MB</p>
                {videoResult.video.thumbnail && (
                  <div className="mt-2">
                    <p><strong>Thumbnail:</strong></p>
                    <img 
                      src={videoResult.video.thumbnail} 
                      alt="Thumbnail"
                      className="max-w-xs rounded border"
                    />
                  </div>
                )}
                <div className="mt-2">
                  <video 
                    src={videoResult.video.url} 
                    controls
                    className="max-w-md rounded border"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 font-semibold">❌ Erreur</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}