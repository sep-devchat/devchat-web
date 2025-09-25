import { CPHeader, CPHeaderLeft, CPTitle, MemberAvatar, MemberAvatarContainer, MemberContent, MemberCount, MemberItem, MemberName, MemberSection, MembersList, OfflineIndicator, OnlineIndicator, PageWrapper, SectionHeader, SectionTitle, Tooltip, TooltipAvatar, TooltipCard, TooltipContainer, TooltipHeader, TooltipInput, TooltipName, TooltipUsername } from './MemberList.styled'
import { useState } from 'react'

const mockMembers = {
  status: [
    {
      id: 1,
      name: "Nguyen Van A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isOnline: true
    },
    {
      id: 2,
      name: "Nguyen Van B",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isOnline: false,
    },
    {
      id: 3,
      name: "Nguyen Van C",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isOnline: true
    },
    {
      id: 4,
      name: "Nguyen Van D",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      isOnline: false
    }
  ],
}

export interface TooltipProps {
  show: boolean
}

export default function MemberList() {
  const [hoveredMember, setHoveredMember] = useState(null)

  const onlineMembers = mockMembers.status.filter(member => member.isOnline === true)
  const offlineMembers = mockMembers.status.filter(member => member.isOnline === false)

  const handleMouseEnter = (memberId: any) => {
    setHoveredMember(memberId)
  }

  const handleMouseLeave = () => {
    setHoveredMember(null)
  }

  return (
    <PageWrapper>
      <CPHeader>
        <CPHeaderLeft>
          <CPTitle>
            Member List
          </CPTitle>
        </CPHeaderLeft>
      </CPHeader>
      <MemberContent>
        <MemberSection>
          <SectionHeader>
            <SectionTitle>Online</SectionTitle>
            <MemberCount>{onlineMembers.length}</MemberCount>
          </SectionHeader>
          <MembersList>
            {onlineMembers.map(member => (
              <TooltipContainer
                onMouseEnter={() => handleMouseEnter(member.id)}
                onMouseLeave={handleMouseLeave}
              >
                <MemberItem>
                  <MemberAvatarContainer>
                    <MemberAvatar src={member.avatar} alt={member.name} />
                    <OnlineIndicator />
                  </MemberAvatarContainer>
                  <MemberName>{member.name}</MemberName>
                </MemberItem>

                <Tooltip show={hoveredMember === member.id}>
                  <TooltipCard>
                    <TooltipHeader>
                      <TooltipAvatar src={member.avatar} alt={member.name} />
                      <div>
                        <TooltipName>{member.name}</TooltipName>
                        <TooltipUsername>@{member.name.toLowerCase().replace(/\s+/g, '')}</TooltipUsername>
                      </div>
                    </TooltipHeader>

                    <TooltipInput
                      type="text"
                      placeholder={`Message @${member.name.split(' ')[0]}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          console.log(
                            `Send message to ${member.name}:`,
                            (e.target as HTMLInputElement).value
                          )
                            ; (e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                  </TooltipCard>
                </Tooltip>
              </TooltipContainer>

            ))}
          </MembersList>
        </MemberSection>
        <MemberSection>
          <SectionHeader>
            <SectionTitle>Offline</SectionTitle>
            <MemberCount>{offlineMembers.length}</MemberCount>
          </SectionHeader>
          <MembersList>
            {offlineMembers.map(member => (
              <TooltipContainer
                onMouseEnter={() => handleMouseEnter(member.id)}
                onMouseLeave={handleMouseLeave}
              >
                <MemberItem>
                  <MemberAvatarContainer>
                    <MemberAvatar src={member.avatar} alt={member.name} />
                    <OfflineIndicator />
                  </MemberAvatarContainer>
                  <MemberName>{member.name}</MemberName>
                </MemberItem>

                <Tooltip show={hoveredMember === member.id}>
                  <TooltipCard>
                    <TooltipHeader>
                      <TooltipAvatar src={member.avatar} alt={member.name} />
                      <div>
                        <TooltipName>{member.name}</TooltipName>
                        <TooltipUsername>@{member.name.toLowerCase().replace(/\s+/g, '')}</TooltipUsername>
                      </div>
                    </TooltipHeader>

                    <TooltipInput
                      type="text"
                      placeholder={`Message @${member.name.split(' ')[0]}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          console.log(
                            `Send message to ${member.name}:`,
                            (e.target as HTMLInputElement).value
                          )
                            ; (e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                  </TooltipCard>
                </Tooltip>
              </TooltipContainer>
            ))}
          </MembersList>
        </MemberSection>
      </MemberContent>
    </PageWrapper>
  )
}