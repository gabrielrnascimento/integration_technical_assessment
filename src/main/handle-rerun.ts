export const handleRerun = async (): Promise<void> => {
  await new Promise(resolve => {
    setTimeout(resolve, parseInt(process.env.MINUTES_TO_RERUN) * 60 * 1000);
  });
};
