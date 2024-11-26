import { useState, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { MOCK_SCHEDULE } from "@/app/(authenticated)/schedules/_dummies/shcedule-mock-data";
import { MOCK_STUDIOS } from "@/app/(authenticated)/studios/_dummies/studio-mock-data";
import { MOCK_FILMS } from "@/app/(authenticated)/films/_dummies/mock-film-data";

export const useFetchSchedule = (scheduleId: string) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        const foundSchedule = MOCK_SCHEDULE.data.find((schedule) => schedule.id === scheduleId);

        if (!foundSchedule) {
          message.error("Schedule not found.");
          return;
        }

        const foundStudios = MOCK_STUDIOS.data.filter(
          (studio) => studio.id === foundSchedule.studioId,
        );

        const foundFilm = MOCK_FILMS.data.find((film) => film.id === foundSchedule.filmId);

        const studios = foundStudios.map((studio) => ({
          id: studio.id,
          name: studio.name,
        }));

        const scheduleDateTime = dayjs.utc(foundSchedule.showTime);

        const scheduleData = {
          id: foundSchedule.id,
          studios,
          foundFilm,
          date: scheduleDateTime.format("YYYY-MM-DD"),
          showTime: scheduleDateTime.format("HH:mm"),
        };

        setData(scheduleData);
      } catch (error) {
        message.error("Failed to fetch schedule data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  return { data, isLoading };
};
