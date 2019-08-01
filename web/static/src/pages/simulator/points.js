class Points {
  constructor(point = [], pointStep) {
    this.pointParam = point;
    this.pointLengh = point.length;
    this.mapStep = pointStep;
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
          Math.pow(pointPrev[0] - pointNext[0], 2) +
            Math.pow(pointPrev[1] - pointNext[1], 2)
        );
        times = parseInt(pathLine / this.mapStep);
        if (times > 1) {
          let stepPoint;
          for (let j = 1; j < times; j++) {
            const latInset = ((pointNext[0] - pointPrev[0]) / times) * j;
            const lonInset = ((pointNext[1] - pointPrev[1]) / times) * j;
            stepPoint = [
              pointPrev[0] * 1 + latInset.toFixed(9) * 1,
              pointPrev[1] * 1 + lonInset.toFixed(9) * 1
            ];
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
