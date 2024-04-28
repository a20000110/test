import { useLocale } from "next-intl";
import axios from "axios";
import { ICountry, IState } from "country-state-city";

const baseUrl = process.env.NEXT_PUBLIC_AI_URL!;

interface CountryDataResponse {
  code: number;
  msg: string;
  status: string;
  result: CountryResult;
}

interface CountryResult {
  country: ICountry[];
}



interface StateDataResponse {
  code: number;
  msg: string;
  status: string;
  result: StateResult;
}

interface StateResult {
  region: IState[];
}

export const useCountry = () => {
  const locale = useLocale();

  const getCountryList = async (): Promise<ICountry[]> => {
    try {
      const res = await axios.post<CountryDataResponse>(`${baseUrl}/api/v1/ml_web/get_translate_country_json?language_code=${locale}`);
      if (res.data.code === 200) {
        return res.data.result.country;
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  };

  const getStateListByCode = async (countryCode: string): Promise<IState[]> => {
    try {
      const res = await axios.post<StateDataResponse>(`${baseUrl}/api/v1/ml_web/get_translate_region_json?language_code=${locale}&iso_code=${countryCode}`);
      if (res.data.code === 200) {
        return res.data.result.region;
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  return {
    getCountryList,
    getStateListByCode
  };
};
