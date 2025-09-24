import { CPHeader, CPHeaderIcon, CPHeaderLeft, CPTitle, PageWrapper } from './CodeList.styled'
import { SquareCode, X } from 'lucide-react'

export default function CodeList() {
  return (
    <PageWrapper>
      <CPHeader>
        <CPHeaderLeft>
          <CPHeaderIcon>
            <SquareCode />
          </CPHeaderIcon>
          <CPTitle>
            Code List
          </CPTitle>
        </CPHeaderLeft>

        <CPHeaderLeft>
          <X />
        </CPHeaderLeft>
      </CPHeader>
    </PageWrapper>
  )
}
