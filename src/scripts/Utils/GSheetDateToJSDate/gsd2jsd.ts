export default function GSDateToJSDate(googleSheetDate: string): Date {
  // Convert Date(2024,2,6,15,0,0) or Date(2024,2,6) (for example) to a JS date
  const nunmsOnly = googleSheetDate.replaceAll("Date(", "").replaceAll(")", "");
  const nums = nunmsOnly.split(",");
  if (nums.length === 3) {
    // Date(2024,2,6) (for example)
    return new Date(parseInt(nums[0]), parseInt(nums[1]), parseInt(nums[2]));
  } else if (nums.length === 6) {
    // Date(2024,2,6,15,0,0) (for example)
    return new Date(
      parseInt(nums[0]),
      parseInt(nums[1]),
      parseInt(nums[2]),
      parseInt(nums[3]),
      parseInt(nums[4]),
      parseInt(nums[5]),
    );
  } else {
    throw new Error("Invalid date");
  }
}
