import { Stack, Typography } from "@mui/material";

const About = () => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
      }}
      gap={2}
    >
      <Typography variant="h5">About the project</Typography>

      <Typography variant="body1">
        This project was created by{" "}
        <Typography
          variant="body1"
          component="a"
          href="http://cv.gsavvidis.com/"
          target="_blank"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Giannis Savvidis
        </Typography>{" "}
        for fun and showcasing purposes. The main technologies used include
        Typescript, React.js, and supabase. Future plans for this project
        involve migrating the client to Next.js and utilizing the Prisma ORM
        instead of the supabase JavaScript SDK. This change aims to improve
        Typescript support and provide more elegant database migrations. You can
        find the GitHub repository for this project{" "}
        <Typography
          variant="body1"
          component="a"
          href="https://github.com/gsavvidis96/budget-calculator"
          target="_blank"
          sx={{
            textDecoration: "none",
            color: "primary.main",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          here
        </Typography>
        .
      </Typography>
    </Stack>
  );
};

export default About;
