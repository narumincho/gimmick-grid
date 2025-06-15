import { assertEquals } from "@std/assert";
import { directionsToStepNumber, stepNumberToDirections } from "./position.ts";

Deno.test("stepNumberToDirections", () => {
  assertEquals(stepNumberToDirections(0), [
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ]);
  assertEquals(stepNumberToDirections(1), [
    "right",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ]);
  assertEquals(stepNumberToDirections(4), [
    "up",
    "right",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ]);
  assertEquals(stepNumberToDirections(4 ** 9), [
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
    "up",
  ]);
});
Deno.test("directionsToStepNumber", () => {
  assertEquals(
    directionsToStepNumber([
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
    ]),
    0,
  );

  assertEquals(
    directionsToStepNumber([
      "right",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
    ]),
    1,
  );
  assertEquals(
    directionsToStepNumber([
      "up",
      "right",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
      "up",
    ]),
    4,
  );
});
