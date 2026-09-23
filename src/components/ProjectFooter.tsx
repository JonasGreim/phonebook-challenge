import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Container, IconButton, Tooltip, Typography } from '@mui/material';
import { translations, type Locale } from '../i18n.js';

const AUTHOR_NAME = 'Jonas Greim';
const GITHUB_PROFILE_URL = 'https://github.com/JonasGreim';
const LINKEDIN_PROFILE_URL = 'http://www.linkedin.com/in/jonas-greim-dev';

interface ProjectFooterProps {
  locale: Locale;
}

export default function ProjectFooter({ locale }: ProjectFooterProps) {
  const text = translations[locale];
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          py: 2.5,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
            gap: 1.5,
            justifyContent: 'center',
          }}
        >
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.43,
              whiteSpace: 'nowrap',
            }}
            variant="body2"
          >
            © {year} {AUTHOR_NAME}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title={text.githubProfileLinkLabel}>
              <IconButton
                aria-label={text.githubProfileLinkLabel}
                component="a"
                href={GITHUB_PROFILE_URL}
                rel="noreferrer"
                size="small"
                sx={{
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 3,
                  },
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  },
                  color: 'text.secondary',
                  minHeight: 32,
                  minWidth: 32,
                }}
                target="_blank"
              >
                <GitHubIcon aria-hidden="true" sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={text.linkedInProfileLinkLabel}>
              <IconButton
                aria-label={text.linkedInProfileLinkLabel}
                component="a"
                href={LINKEDIN_PROFILE_URL}
                rel="noreferrer"
                size="small"
                sx={{
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 3,
                  },
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                  },
                  color: 'text.secondary',
                  minHeight: 32,
                  minWidth: 32,
                }}
                target="_blank"
              >
                <LinkedInIcon aria-hidden="true" sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
