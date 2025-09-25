import { CPHeader, CPHeaderIcon, CPHeaderLeft, CPTitle, PageWrapper } from './ThreadPanel.styled'
import { Spool, X } from 'lucide-react'

export default function ThreadPanel() {
  return (
    <PageWrapper>
      <CPHeader>
        <CPHeaderLeft>
          <CPHeaderIcon>
            <Spool />
          </CPHeaderIcon>
          <CPTitle>
            Thread
          </CPTitle>
        </CPHeaderLeft>

        <CPHeaderLeft>
          <X />
        </CPHeaderLeft>
      </CPHeader>
    </PageWrapper>
  )
}
