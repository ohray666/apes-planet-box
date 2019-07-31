class Points {
  constructor(point = [], pointStep) {
    this.pointParam = point;
    this.pointLengh = point.length;
    this.mapStep = pointStep || 0.000001;
    this.points = [point[0]];
  }

  get = () => {
    if (!this.pointLengh) {
      return [];
    }
    for (let i = 1; i <= this.pointLengh; i++) {
      const pointPrev = this.pointParam[i - 1];
      const pointNext = this.pointParam[i];
      let pathLine;
      let times = 0;
      if (pointPrev && pointNext) {
        pathLine = Math.sqrt(
          Math.pow(pointPrev.point.lat - pointNext.point.lat, 2) +
            Math.pow(pointPrev.point.lon - pointNext.point.lon, 2)
        );
        times = parseInt(pathLine / this.mapStep);
        if (times > 1) {
          let stepPoint;
          for (let j = 1; j < times; j++) {
            const latInset =
              ((pointNext.point.lat - pointPrev.point.lat) / times) * j;
            const lonInset =
              ((pointNext.point.lon - pointPrev.point.lon) / times) * j;
            stepPoint = {
              point: {
                lat: pointPrev.point.lat * 1 + latInset.toFixed(9) * 1,
                lon: pointPrev.point.lon * 1 + lonInset.toFixed(9) * 1
              }
            };
            this.points.push(stepPoint);
          }
        }
        this.points.push(pointNext);
      }
    }
    return this.points;
  };
}
export default Points;
