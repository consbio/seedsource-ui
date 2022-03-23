import { t } from 'ttag'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ModalCard from './ModalCard'
import config from '../config'
import { dumpConfiguration } from '../actions/saves'
import { post } from '../io'

type ShareURLProps = {
  configuration: any
  version: number
}

const ShareURL = ({ configuration, version }: ShareURLProps) => {
  const [url, setUrl] = useState('')
  const [fetchingUrl, setFetchingUrl] = useState(false)
  const [urlError, setUrlError] = useState('')
  const [urlCopied, setUrlCopied] = useState(false)

  const resetState = () => {
    setUrl('')
    setFetchingUrl(false)
    setUrlError('')
    setUrlCopied(false)
  }

  const onFetchURL = () => {
    resetState()
    setFetchingUrl(true)
    const shareUrl = `${config.apiRoot}share-urls/`
    const data = {
      configuration: JSON.stringify(dumpConfiguration(configuration)),
      version,
    }
    post(shareUrl, data)
      .then(response => {
        const { status } = response
        if (status >= 200 && status < 300) {
          return response.json()
        }
        setUrlError(`There was a problem creating your url: ${response.status}`)
      })
      .then(json => {
        const { location } = window
        const { protocol, host, pathname } = location
        setUrl(`${protocol}//${host + pathname}?s=${json.hash}`)
      })
      .finally(() => {
        setFetchingUrl(false)
      })
  }

  const modalContent = () => {
    if (url) {
      return <a href={url}>{url}</a>
    }
    if (urlError) {
      return urlError
    }
    return 'Loading Url...'
  }

  return (
    <>
      <ModalCard
        title="Share URL"
        active={fetchingUrl || !!url || !!urlError}
        footer={(
          <div style={{ textAlign: 'right', width: '100%' }}>
            {urlCopied && <p style={{ color: 'red', display: 'inline-block', padding: '8px' }}>{t`Copied`}</p>}
            {url && (
              <CopyToClipboard text={url} onCopy={() => setUrlCopied(true)}>
                <button type="button" className="button" disabled={urlCopied}>
                  {t`Copy to clipboard`}
                </button>
              </CopyToClipboard>
            )}
            <button type="button" onClick={resetState} className="button is-primary is-pulled-right">
              {t`Done`}
            </button>
          </div>
        )}
      >
        {modalContent()}
      </ModalCard>
      <button type="button" onClick={onFetchURL} className="button">
        <span className="icon-share-12" aria-hidden="true" /> &nbsp;{t`Get URL`}
      </button>
    </>
  )
}

export default ShareURL
