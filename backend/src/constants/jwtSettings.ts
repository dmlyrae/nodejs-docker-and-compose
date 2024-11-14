import { ms } from 'src/helpers/milliseconds';

const JWTSettings = {
  TOKEN_MAX_AGE: ms.days(7),
};

export default JWTSettings;
